const mysql = require("mysql");
const config = require("../config/config");
const slugify = require("slugify");

const pool = mysql.createPool(config.db);

class Post {
  static async create(postData) {
    return new Promise((resolve, reject) => {
      // Gerekli kontroller
      const requiredFields = ['post_title', 'post_content', 'post_author', 'post_category'];
      for (const field of requiredFields) {
        if (!postData[field]) {
          return reject(new Error(`${field} alanı zorunludur`));
        }
      }

      // Slug oluştur
      const slug = slugify(postData.post_title, {
        lower: true,
        strict: true,
        locale: "tr",
        remove: /[*+~.()'"!:@]/g
      });

      const insertData = {
        ...postData,
        post_slug: slug,
        post_excerpt: postData.post_excerpt || '',
        post_tags: postData.post_tags || '',
        post_status: postData.post_status || 'draft',
        post_createdAt: new Date()
      };

      pool.query('INSERT INTO posts SET ?', insertData, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          p.*,
          u.user_name as author_name,
          u.user_profileImage as author_image,
          c.category_name,
          c.category_slug
        FROM posts p
        LEFT JOIN users u ON p.post_author = u.user_id
        LEFT JOIN categories c ON p.post_category = c.category_id
        WHERE 1=1
      `;

      const queryParams = [];
      
      // Filtreleri uygula
      if (filters.status) {
        query += " AND p.post_status = ?";
        queryParams.push(filters.status);
      }

      if (filters.category) {
        query += " AND p.post_category = ?";
        queryParams.push(filters.category);
      }

      if (filters.author) {
        query += " AND p.post_author = ?";
        queryParams.push(filters.author);
      }

      // Sıralama ve sayfalama
      query += " ORDER BY p.post_createdAt DESC";
      
      if (filters.limit > 0) {
        const page = Math.max(1, filters.page || 1);
        const offset = (page - 1) * filters.limit;
        query += " LIMIT ? OFFSET ?";
        queryParams.push(parseInt(filters.limit), offset);
      }

      pool.query(query, queryParams, (error, results) => {
        if (error) {
          console.error('Posts getirme hatası:', error);
          return reject(error);
        }
        resolve(results || []);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, 
               u.user_name as author_name, 
               u.user_profileImage as author_image,
               c.category_name as category_name,
               c.category_slug as category_slug
        FROM posts p 
        LEFT JOIN users u ON p.post_author = u.user_id 
        LEFT JOIN categories c ON p.post_category = c.category_id 
        WHERE p.post_id = ?`;

      pool.query(query, [id], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results[0]);
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
        "UPDATE posts SET post_views = post_views + 1 WHERE post_id = ?",
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
        ? "UPDATE posts SET post_likes = post_likes + 1 WHERE post_id = ?"
        : "UPDATE posts SET post_likes = post_likes - 1 WHERE post_id = ?";

      pool.query(query, [id], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async findByIdentifier(identifier) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, 
               u.user_name as author_name, 
               u.user_profileImage as author_image,
               c.category_name as category_name,
               c.category_slug as category_slug
        FROM posts p 
        LEFT JOIN users u ON p.post_author = u.user_id 
        LEFT JOIN categories c ON p.post_category = c.category_id 
        WHERE p.post_id = ? OR p.post_slug = ?`;

      pool.query(query, [identifier, identifier], (error, results) => {
        if (error) {
          console.error("Find post error:", error);
          return reject(error);
        }
        resolve(results[0]);
      });
    });
  }

  static async update(identifier, postData) {
    return new Promise((resolve, reject) => {
      // Önce postu bul
      this.findByIdOrSlug(identifier)
        .then((post) => {
          if (!post) {
            return reject(new Error("Blog yazısı bulunamadı"));
          }

          let updateFields = [];
          let queryParams = [];

          if (postData.post_title) {
            updateFields.push("post_title = ?");
            queryParams.push(postData.post_title);

            // Başlık değiştiğinde slug'ı da güncelle
            updateFields.push("post_slug = ?");
            queryParams.push(
              slugify(postData.post_title, {
                lower: true,
                strict: true,
                locale: "tr",
              })
            );
          }

          if (postData.post_excerpt !== undefined) {
            updateFields.push("post_excerpt = ?");
            queryParams.push(postData.post_excerpt);
          }

          if (postData.post_content !== undefined) {
            updateFields.push("post_content = ?");
            queryParams.push(postData.post_content);
          }

          if (postData.post_category !== undefined) {
            updateFields.push("post_category = ?");
            queryParams.push(postData.post_category);
          }

          if (postData.post_status !== undefined) {
            updateFields.push("post_status = ?");
            queryParams.push(postData.post_status);
          }

          if (postData.post_image) {
            updateFields.push("post_image = ?");
            queryParams.push(postData.post_image);
          }

          // Updated_at alanını güncelle
          updateFields.push("post_updatedAt = CURRENT_TIMESTAMP");

          queryParams.push(post.post_id); // WHERE koşulu için post_id

          const query = `UPDATE posts SET ${updateFields.join(
            ", "
          )} WHERE post_id = ?`;

          pool.query(query, queryParams, (error, results) => {
            if (error) {
              return reject(error);
            }
            resolve(results);
          });
        })
        .catch(reject);
    });
  }

  static async delete(identifier) {
    return new Promise((resolve, reject) => {
      // Önce postu bul
      this.findByIdOrSlug(identifier)
        .then((post) => {
          if (!post) {
            return reject(new Error("Blog yazısı bulunamadı"));
          }

          // Postu sil
          pool.query(
            "DELETE FROM posts WHERE post_id = ?",
            [post.post_id],
            (error, results) => {
              if (error) {
                return reject(error);
              }

              if (results.affectedRows === 0) {
                return reject(new Error("Blog yazısı silinemedi"));
              }

              resolve(results);
            }
          );
        })
        .catch(reject);
    });
  }

  static async findByIdOrSlug(identifier) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.*,
          u.user_name as author_name,
          u.user_profileImage as author_image,
          c.category_name,
          c.category_slug
        FROM posts p
        LEFT JOIN users u ON p.post_author = u.user_id
        LEFT JOIN categories c ON p.post_category = c.category_id
        WHERE p.post_id = ? OR p.post_slug = ?
      `;

      pool.query(query, [identifier, identifier], (error, results) => {
        if (error) {
          console.error("Post arama hatası:", error);
          return reject(error);
        }
        resolve(results[0]);
      });
    });
  }
}

module.exports = Post;
