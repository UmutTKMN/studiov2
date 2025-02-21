const mysql = require('mysql');
const config = require('../config/config');

const pool = mysql.createPool(config.db);

class User {
  static async create(userData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (
          user_name, user_email, user_password, user_bio, user_role,
          user_profileImage, user_university, user_department, 
          user_graduationYear, user_degree, user_company, user_position,
          user_yearsOfExperience, user_currentlyWorking,
          user_instagram, user_twitter, user_linkedin, user_github,
          user_country, user_city, user_postalCode,
          user_theme, user_language, user_emailNotifications, user_pushNotifications
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      pool.query(
        query,
        [
          userData.user_name,
          userData.user_email,
          userData.user_password,
          userData.user_bio || null,
          userData.user_role,
          userData.user_profileImage || null,
          userData.user_university || null,
          userData.user_department || null,
          userData.user_graduationYear || null,
          userData.user_degree || null,
          userData.user_company || null,
          userData.user_position || null,
          userData.user_yearsOfExperience || null,
          userData.user_currentlyWorking || false,
          userData.user_instagram || null,
          userData.user_twitter || null,
          userData.user_linkedin || null,
          userData.user_github || null,
          userData.user_country || null,
          userData.user_city || null,
          userData.user_postalCode || null,
          userData.user_theme || 'light',
          userData.user_language || 'en',
          userData.user_emailNotifications !== false,
          userData.user_pushNotifications !== false
        ],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.*, r.role_name 
        FROM users u
        LEFT JOIN roles r ON u.user_role = r.role_id 
        WHERE u.user_email = ?`;
        
      pool.query(query, [email], (error, results) => {
        if (error) {
          console.error('Database error:', error);
          return reject(error);
        }
        if (!results || results.length === 0) {
          return resolve(null);
        }
        resolve(results[0]);
      });
    });
  }

  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM users WHERE user_username = ?",
        [username],
        (error, results) => {
          if (error) reject(error);
          resolve(results[0]);
        }
      );
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return resolve(null);
      }

      const query = `
        SELECT users.*, roles.role_name 
        FROM users 
        LEFT JOIN roles ON users.user_role = roles.role_id 
        WHERE users.user_id = ?`;

      pool.query(query, [id], (error, results) => {
        if (error) {
          console.error('Database error:', error);
          return reject(error);
        }
        
        // Eğer sonuç yoksa null dön
        if (!results || results.length === 0) {
          return resolve(null);
        }

        resolve(results[0]);
      });
    });
  }

  static async update(id, userData) {
    return new Promise((resolve, reject) => {
      const updateFields = [];
      const queryParams = [];

      // Güncellenebilir alanlar
      const updatableFields = [
        'user_name', 'user_email', 'user_bio', 'user_profileImage',
        'user_university', 'user_department', 'user_graduationYear', 'user_degree',
        'user_company', 'user_position', 'user_yearsOfExperience', 'user_currentlyWorking',
        'user_instagram', 'user_twitter', 'user_linkedin', 'user_github',
        'user_country', 'user_city', 'user_postalCode',
        'user_theme', 'user_language', 'user_emailNotifications', 'user_pushNotifications'
      ];

      updatableFields.forEach(field => {
        if (userData[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          queryParams.push(userData[field]);
        }
      });

      queryParams.push(id);

      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
      pool.query(query, queryParams, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM users WHERE user_id = ?",
        [id],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  static async updateLoginAttempts(id, attempts) {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE users SET login_attempts = ?, last_login_attempt = NOW() WHERE user_id = ?",
        [attempts, id],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  static async resetLoginAttempts(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE users SET login_attempts = 0, last_login_attempt = NULL WHERE user_id = ?",
        [id],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  static async updateLastLogin(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE users 
        SET user_last_login = CURRENT_TIMESTAMP,
            user_login_count = COALESCE(user_login_count, 0) + 1,
            user_failed_login_attempts = 0,
            user_last_failed_login = NULL
        WHERE user_id = ?`;

      pool.query(query, [userId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async getLoginHistory(userId, limit = 10) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT *
        FROM activity_logs
        WHERE log_user_id = ?
        AND log_action IN ('LOGIN', 'LOGIN_FAILED')
        ORDER BY log_createdAt DESC
        LIMIT ?`;

      pool.query(query, [userId, limit], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async updateFailedLogin(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE users 
        SET user_failed_login_attempts = COALESCE(user_failed_login_attempts, 0) + 1,
            user_last_failed_login = CURRENT_TIMESTAMP
        WHERE user_id = ?`;

      pool.query(query, [userId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }
}

module.exports = User;
