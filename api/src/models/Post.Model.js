const pool = require("../config/pool");
const slugify = require("slugify");

class Post {
  static async create(postData) {
    try {
      // Gerekli kontroller
      const requiredFields = ["post_title", "post_content"];
      for (const field of requiredFields) {
        if (!postData[field]) {
          throw new Error(`${field} alanı zorunludur`);
        }
      }

      // Slug oluştur
      const slug = slugify(postData.post_title, {
        lower: true,
        strict: true,
        locale: "tr",
        remove: /[*+~.()'"!:@]/g,
      });

      const query = `
        INSERT INTO posts 
        (post_title, post_slug, post_content, post_author, post_excerpt, 
        post_category, post_tags, post_status, post_image, post_createdAt)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        postData.post_title,
        slug,
        postData.post_content,
        postData.post_author,
        postData.post_excerpt || "",
        postData.post_category,
        postData.post_tags || "",
        postData.post_status || "draft",
        postData.post_image || null,
        new Date(),
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll({ filters = {}, sort = {}, pagination = {} }) {
    try {
      let query = "SELECT * FROM posts";
      const params = [];
      const whereConditions = [];
      let paramCount = 1;

      if (filters.post_status) {
        whereConditions.push(`post_status = $${paramCount}`);
        params.push(filters.post_status);
        paramCount++;
      }

      if (filters.search) {
        whereConditions.push(
          `(post_title LIKE $${paramCount} OR post_content LIKE $${
            paramCount + 1
          })`
        );
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
        paramCount += 2;
      }

      if (whereConditions.length > 0) {
        query += " WHERE " + whereConditions.join(" AND ");
      }

      // Sıralama
      const sortField = sort.field || "post_createdAt";
      const sortDirection = sort.direction || "DESC";
      query += ` ORDER BY ${sortField} ${sortDirection}`;

      // Önce toplam sayıyı al
      const countQuery = `SELECT COUNT(*) as total FROM posts`;
      const countResult = await pool.query(countQuery);
      const total = parseInt(countResult.rows[0].total);

      // Sayfalama
      const limit = parseInt(pagination.limit) || 10;
      const page = Math.max(1, pagination.page || 1);
      const offset = (page - 1) * limit;
      query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(limit, offset);

      // Asıl verileri getir
      const result = await pool.query(query, params);

      return {
        posts: result.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Posts bulunamadı: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const query = `
        SELECT p.*, 
               u.user_name as author_name, 
               u.user_profileImage as author_image,
               c.category_name as category_name,
               c.category_slug as category_slug
        FROM posts p 
        LEFT JOIN users u ON p.post_author = u.user_id 
        LEFT JOIN categories c ON p.post_category = c.category_id 
        WHERE p.post_id = $1`;

      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const query = `
        SELECT p.*, c.category_name as category_name 
        FROM posts p 
        LEFT JOIN categories c ON p.post_category = c.category_id 
        WHERE p.post_author = $1
        ORDER BY p.post_createdAt DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByIdentifier(identifier) {
    try {
      const query = `
        SELECT p.*, 
               u.user_name as author_name, 
               u.user_profileImage as author_image,
               c.category_name as category_name,
               c.category_slug as category_slug
        FROM posts p 
        LEFT JOIN users u ON p.post_author = u.user_id 
        LEFT JOIN categories c ON p.post_category = c.category_id 
        WHERE p.post_id = $1 OR p.post_slug = $2`;

      const result = await pool.query(query, [identifier, identifier]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(identifier, postData) {
    try {
      // Önce postu bul
      const post = await this.findByIdOrSlug(identifier);
      if (!post) {
        throw new Error("Blog yazısı bulunamadı");
      }

      let updateFields = [];
      let queryParams = [];
      let paramCount = 1;

      if (postData.post_title) {
        updateFields.push(
          `post_title = $${paramCount}`,
          `post_slug = $${paramCount + 1}`
        );
        queryParams.push(
          postData.post_title,
          slugify(postData.post_title, {
            lower: true,
            strict: true,
            locale: "tr",
          })
        );
        paramCount += 2;
      }

      if (postData.post_excerpt !== undefined) {
        updateFields.push(`post_excerpt = $${paramCount}`);
        queryParams.push(postData.post_excerpt);
        paramCount++;
      }

      if (postData.post_content !== undefined) {
        updateFields.push(`post_content = $${paramCount}`);
        queryParams.push(postData.post_content);
        paramCount++;
      }

      if (postData.post_category !== undefined) {
        updateFields.push(`post_category = $${paramCount}`);
        queryParams.push(postData.post_category);
        paramCount++;
      }

      if (postData.post_status !== undefined) {
        updateFields.push(`post_status = $${paramCount}`);
        queryParams.push(postData.post_status);
        paramCount++;
      }

      if (postData.post_image) {
        updateFields.push(`post_image = $${paramCount}`);
        queryParams.push(postData.post_image);
        paramCount++;
      }

      // Updated_at alanını güncelle
      updateFields.push("post_updatedAt = CURRENT_TIMESTAMP");

      // WHERE koşulu için post_id
      queryParams.push(post.post_id);

      const query = `
        UPDATE posts 
        SET ${updateFields.join(", ")} 
        WHERE post_id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, queryParams);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(identifier) {
    try {
      // Önce postu bul
      const post = await this.findByIdOrSlug(identifier);
      if (!post) {
        throw new Error("Blog yazısı bulunamadı");
      }

      // Postu sil
      const query = "DELETE FROM posts WHERE post_id = $1 RETURNING *";
      const result = await pool.query(query, [post.post_id]);

      if (result.rowCount === 0) {
        throw new Error("Blog yazısı silinemedi");
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByIdOrSlug(identifier) {
    try {
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
        WHERE p.post_id = $1 OR p.post_slug = $2
      `;

      const result = await pool.query(query, [identifier, identifier]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Post;
