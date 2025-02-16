const mysql = require("mysql");
const config = require("../config/config");
const slugify = require('slugify'); // Slug oluşturmak için ekleyin

const pool = mysql.createPool(config.db);

class Post {
  static async create(postData) {
    return new Promise((resolve, reject) => {
      const slug = slugify(postData.post_title, { lower: true, strict: true });
      const query = `
        INSERT INTO posts (
          post_title, post_slug, post_excerpt, post_content, 
          post_author, post_category, post_tags, post_image, 
          post_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      pool.query(
        query,
        [
          postData.post_title,
          slug,
          postData.post_excerpt,
          postData.post_content,
          postData.post_author,
          postData.post_category,
          postData.post_tags,
          postData.post_image,
          postData.post_status || 'draft'
        ],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, 
               u.user_name as author_name, 
               u.user_profileImage as author_image,
               c.category_name as category_name,
               p.post_author
        FROM posts p 
        LEFT JOIN users u ON p.post_author = u.user_id 
        LEFT JOIN categories c ON p.post_category = c.category_id 
        WHERE p.post_id = ?`;

      pool.query(query, [id], (error, results) => {
        if (error) {
          console.error('Find post by id error:', error);
          return reject(error);
        }
        resolve(results[0]);
      });
    });
  }

  static async findBySlug(slug) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, 
               u.user_name as author_name, 
               u.user_profileImage as author_image,
               c.category_name as category_name
        FROM posts p 
        LEFT JOIN users u ON p.post_author = u.user_id 
        LEFT JOIN categories c ON p.post_category = c.category_id 
        WHERE p.post_slug = ?`;

      pool.query(query, [slug], (error, results) => {
        if (error) reject(error);
        resolve(results[0]);
      });
    });
  }

  static async findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      // Basit bir sorgu ile post tablosunu kontrol et 
      const checkQuery = "SELECT COUNT(*) as count FROM posts";
      pool.query(checkQuery, [], (error, countResult) => {
        if (error) {
          console.error('Check query error:', error);
          return reject(error);
        }
        console.log('Total posts in database:', countResult[0].count); // Debug için
      });

      let query = `
        SELECT 
          p.*, 
          u.user_name as author_name, 
          u.user_profileImage as author_image,
          c.category_name
        FROM posts p 
        LEFT JOIN users u ON p.post_author = u.user_id 
        LEFT JOIN categories c ON p.post_category = c.category_id
        WHERE 1=1`;  

      const queryParams = [];

      // Status kontrolünü değiştir - test için tüm postları getir
      if (filters.status) {
        query += " AND p.post_status = ?";
        queryParams.push(filters.status);
      }
      // else {
      //   query += " AND p.post_status = 'published'";
      // }

      if (filters.category) {
        query += " AND p.post_category = ?";
        queryParams.push(filters.category);
      }

      if (filters.author) {
        query += " AND p.post_author = ?";
        queryParams.push(filters.author);
      }

      if (filters.search) {
        query += " AND (p.post_title LIKE ? OR p.post_content LIKE ?)";
        queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      // Sıralama
      query += " ORDER BY p.post_createdAt DESC";

      // Sayfalama
      if (filters.limit) {
        const limit = parseInt(filters.limit);
        const page = parseInt(filters.page) || 1;
        const offset = (page - 1) * limit;
        
        query += " LIMIT ? OFFSET ?";
        queryParams.push(limit, offset);
      }

      console.log('Final SQL Query:', query); // Debug için
      console.log('Final Query Params:', queryParams); // Debug için

      pool.query(query, queryParams, (error, results) => {
        if (error) {
          console.error('Find all posts error:', error);
          return reject(error);
        }
        console.log('Found posts count:', results?.length); // Debug için
        console.log('First post sample:', results?.[0]); // İlk postu göster
        resolve(results || []);
      });
    });
  }

  static async update(id, postData) {
    return new Promise((resolve, reject) => {
      let updateFields = [];
      let queryParams = [];

      if (postData.post_title) {
        updateFields.push('post_title = ?');
        queryParams.push(postData.post_title);
        
        // Başlık değiştiyse slug da güncelle
        updateFields.push('post_slug = ?');
        queryParams.push(slugify(postData.post_title, { lower: true, strict: true }));
      }

      const updatableFields = [
        'post_excerpt', 'post_content', 'post_category', 
        'post_tags', 'post_image', 'post_status'
      ];

      updatableFields.forEach(field => {
        if (postData[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          queryParams.push(postData[field]);
        }
      });

      queryParams.push(id);

      const query = `UPDATE posts SET ${updateFields.join(', ')} WHERE post_id = ?`;
      
      pool.query(query, queryParams, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM posts WHERE post_id = ?", [id], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, c.category_name as category_name 
        FROM posts p 
        LEFT JOIN categories c ON p.post_category = c.category_id 
        WHERE p.post_author = ?
        ORDER BY p.post_createdAt DESC
      `;
      pool.query(query, [userId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async incrementViews(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE posts SET post_views = post_views + 1 WHERE post_id = ?',
        [id],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  static async updateLikes(id, increment = true) {
    return new Promise((resolve, reject) => {
      const query = increment 
        ? 'UPDATE posts SET post_likes = post_likes + 1 WHERE post_id = ?'
        : 'UPDATE posts SET post_likes = post_likes - 1 WHERE post_id = ?';

      pool.query(query, [id], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }
}

module.exports = Post;
