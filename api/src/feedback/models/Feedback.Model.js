const mysql = require("mysql");
const config = require("../../config/config");

const pool = mysql.createPool(config.db);

class Feedback {
  static async create(feedbackData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO feedbacks 
        (type, title, description, email, priority, user_id, admin_notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      pool.query(
        query,
        [
          feedbackData.type,
          feedbackData.title,
          feedbackData.description,
          feedbackData.email,
          feedbackData.priority || 'LOW',
          feedbackData.user_id || null,
          feedbackData.admin_notes || null
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
        SELECT f.*, u.user_username as username, u.user_name, u.user_surname
        FROM feedbacks f
        LEFT JOIN users u ON f.user_id = u.user_id
        WHERE f.id = ?
      `;
      
      pool.query(query, [id], (error, results) => {
        if (error) reject(error);
        resolve(results[0]);
      });
    });
  }

  static async findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT f.*, u.user_username as username, u.user_name, u.user_surname
        FROM feedbacks f
        LEFT JOIN users u ON f.user_id = u.user_id
      `;

      const queryParams = [];

      // Filtreler
      const conditions = [];
      
      if (filters.type) {
        conditions.push("f.type = ?");
        queryParams.push(filters.type);
      }

      if (filters.status) {
        conditions.push("f.status = ?");
        queryParams.push(filters.status);
      }

      if (filters.priority) {
        conditions.push("f.priority = ?");
        queryParams.push(filters.priority);
      }

      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        conditions.push("(f.title LIKE ? OR f.description LIKE ?)");
        queryParams.push(searchTerm, searchTerm);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }

      // Sıralama
      query += " ORDER BY f.created_at DESC";

      // Limit
      if (filters.limit) {
        query += " LIMIT ?";
        queryParams.push(parseInt(filters.limit));
      }

      pool.query(query, queryParams, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async update(id, feedbackData) {
    return new Promise((resolve, reject) => {
      const allowedFields = ['status', 'priority', 'admin_notes'];
      const updates = [];
      const values = [];

      Object.keys(feedbackData).forEach(key => {
        if (allowedFields.includes(key)) {
          updates.push(`${key} = ?`);
          values.push(feedbackData[key]);
        }
      });

      if (updates.length === 0) {
        resolve(null);
        return;
      }

      values.push(id);

      const query = `
        UPDATE feedbacks 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;

      pool.query(query, values, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM feedbacks WHERE id = ?",
        [id],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  static async getStats() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          type,
          status,
          priority,
          COUNT(*) as count,
          DATE(created_at) as date
        FROM feedbacks
        GROUP BY type, status, priority, DATE(created_at)
        ORDER BY date DESC, count DESC
      `;

      pool.query(query, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM feedbacks 
        WHERE email = ? 
        ORDER BY created_at DESC
      `;
      
      pool.query(query, [email], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }
}

module.exports = Feedback;
