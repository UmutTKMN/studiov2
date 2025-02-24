const mysql = require("mysql");
const config = require("../config/config");
const slugify = require('slugify'); // Slugify'ı import et

const pool = mysql.createPool(config.db);

class Category {
  static async create(categoryData) {
    return new Promise((resolve, reject) => {
      const slug = slugify(categoryData.category_name, { 
        lower: true, 
        strict: true,
        locale: 'tr' // Türkçe karakterler için
      });
      
      const query = "INSERT INTO categories (category_name, category_slug, category_description) VALUES (?, ?, ?)";
      pool.query(
        query,
        [
          categoryData.category_name,
          slug,
          categoryData.category_description
        ],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  static async findBySlug(slug) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c.*,
          COUNT(p.post_id) as post_count 
        FROM categories c
        LEFT JOIN posts p ON c.category_id = p.post_category
        WHERE c.category_slug = ?
        GROUP BY c.category_id`;

      pool.query(query, [slug], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        
        // Sonuçları formatlayarak döndür
        const category = results && results[0] ? {
          id: results[0].category_id,
          name: results[0].category_name,
          slug: results[0].category_slug,
          description: results[0].category_description,
          post_count: results[0].post_count || 0,
          created_at: results[0].category_createdAt,
          updated_at: results[0].category_updatedAt
        } : null;

        resolve(category);
      });
    });
  }

  static async findAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c.*,
          COUNT(p.post_id) as post_count 
        FROM categories c
        LEFT JOIN posts p ON c.category_id = p.post_category
        GROUP BY c.category_id
        ORDER BY c.category_name ASC`;

      pool.query(query, (error, results) => {
        if (error) return reject(error);
        
        // Sonuçları formatla
        const categories = results ? results.map(category => ({
          id: category.category_id,
          name: category.category_name,
          slug: category.category_slug,
          description: category.category_description,
          post_count: category.post_count || 0,
          created_at: category.category_createdAt,
          updated_at: category.category_updatedAt
        })) : [];

        resolve(categories);
      });
    });
  }

  static async updateBySlug(slug, categoryData) {
    return new Promise((resolve, reject) => {
      let updateFields = [];
      let queryParams = [];

      if (Object.keys(categoryData).length === 0) {
        reject(new Error('Güncellenecek veri bulunamadı'));
        return;
      }

      if (categoryData.category_name) {
        updateFields.push('category_name = ?');
        queryParams.push(categoryData.category_name);
        
        // İsim değiştiğinde yeni slug oluştur
        updateFields.push('category_slug = ?');
        queryParams.push(slugify(categoryData.category_name, { 
          lower: true, 
          strict: true,
          locale: 'tr'
        }));
      }

      if (categoryData.category_description !== undefined) {
        updateFields.push('category_description = ?');
        queryParams.push(categoryData.category_description);
      }

      updateFields.push('category_updatedAt = CURRENT_TIMESTAMP');
      queryParams.push(slug);

      const query = `UPDATE categories SET ${updateFields.join(', ')} WHERE category_slug = ?`;
      
      pool.query(query, queryParams, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static async deleteBySlug(slug) {
    return new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM categories WHERE category_slug = ?",
        [slug],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          
          if (results.affectedRows === 0) {
            reject(new Error('Kategori bulunamadı'));
            return;
          }
          
          resolve(results);
        }
      );
    });
  }

  static async getPostCount(categoryId) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT COUNT(*) as count FROM posts WHERE post_category = ?",
        [categoryId],
        (error, results) => {
          if (error) reject(error);
          resolve(results[0]?.count || 0);
        }
      );
    });
  }

  static async findByIdWithPosts(id) {
    return new Promise((resolve, reject) => {
      const queries = {
        category: `SELECT * FROM categories WHERE category_id = ?`,
        posts: `
          SELECT 
            p.post_id,
            p.post_title,
            p.post_excerpt,
            p.post_image,
            p.post_createdAt,
            u.user_name as author_name,
            u.user_profileImage as author_image
          FROM posts p
          LEFT JOIN users u ON p.post_author = u.user_id
          WHERE p.post_category = ?
          ORDER BY p.post_createdAt DESC
        `
      };

      pool.query(queries.category, [id], (error, categoryResults) => {
        if (error) return reject(error);
        
        if (!categoryResults || categoryResults.length === 0) {
          return resolve(null);
        }

        const category = categoryResults[0];

        pool.query(queries.posts, [id], (error, postResults) => {
          if (error) return reject(error);
          
          category.posts = postResults || [];
          resolve(category);
        });
      });
    });
  }

  static async getPostsBySlug(slug) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.post_id,
          p.post_title,
          p.post_slug,
          p.post_excerpt,
          p.post_content,
          p.post_image,
          p.post_createdAt,
          p.post_updatedAt,
          u.user_name as author_name,
          u.user_profileImage as author_image
        FROM posts p
        INNER JOIN categories c ON p.post_category = c.category_id
        LEFT JOIN users u ON p.post_author = u.user_id
        WHERE c.category_slug = ?
        ORDER BY p.post_createdAt DESC
      `;

      pool.query(query, [slug], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  }
}

module.exports = Category;
