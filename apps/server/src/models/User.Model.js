const pool = require("../config/pool");

class User {
  static async create(userData) {
    try {
      const query = `
        INSERT INTO users (
          user_name, user_email, user_password, user_bio, user_role,
          user_profileImage, user_university, user_department, 
          user_graduationYear, user_degree, user_company, user_position,
          user_yearsOfExperience, user_currentlyWorking,
          user_instagram, user_twitter, user_linkedin, user_github,
          user_country, user_city, user_postalCode,
          user_theme, user_language, user_emailNotifications, user_pushNotifications
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
                 $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
        RETURNING *`;

      const values = [
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
        userData.user_theme || "light",
        userData.user_language || "en",
        userData.user_emailNotifications !== false,
        userData.user_pushNotifications !== false,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = `
        SELECT u.*, r.role_name 
        FROM users u
        LEFT JOIN roles r ON u.user_role = r.role_id 
        WHERE u.user_email = $1`;

      const result = await pool.query(query, [email]);
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }

  static async findByUsername(username) {
    try {
      const query = "SELECT * FROM users WHERE user_username = $1";
      const result = await pool.query(query, [username]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      if (!id) {
        return null;
      }

      const query = `
        SELECT users.*, roles.role_name 
        FROM users 
        LEFT JOIN roles ON users.user_role = roles.role_id 
        WHERE users.user_id = $1`;

      const result = await pool.query(query, [id]);

      if (!result.rows || result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }

  static async update(id, userData) {
    try {
      const updateFields = [];
      const queryParams = [];
      let paramCount = 1;

      // Güncellenebilir alanlar
      const updatableFields = [
        "user_name",
        "user_email",
        "user_bio",
        "user_profileImage",
        "user_university",
        "user_department",
        "user_graduationYear",
        "user_degree",
        "user_company",
        "user_position",
        "user_yearsOfExperience",
        "user_currentlyWorking",
        "user_instagram",
        "user_twitter",
        "user_linkedin",
        "user_github",
        "user_country",
        "user_city",
        "user_postalCode",
        "user_theme",
        "user_language",
        "user_emailNotifications",
        "user_pushNotifications",
      ];

      updatableFields.forEach((field) => {
        if (userData[field] !== undefined) {
          updateFields.push(`${field} = $${paramCount}`);
          queryParams.push(userData[field]);
          paramCount++;
        }
      });

      queryParams.push(id);

      const query = `UPDATE users SET ${updateFields.join(", ")} 
                    WHERE user_id = $${paramCount} 
                    RETURNING *`;

      const result = await pool.query(query, queryParams);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = "DELETE FROM users WHERE user_id = $1 RETURNING *";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateLoginAttempts(id, attempts) {
    try {
      const query =
        "UPDATE users SET login_attempts = $1, last_login_attempt = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *";
      const result = await pool.query(query, [attempts, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async resetLoginAttempts(id) {
    try {
      const query =
        "UPDATE users SET login_attempts = 0, last_login_attempt = NULL WHERE user_id = $1 RETURNING *";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateLastLogin(userId) {
    try {
      const query = `
        UPDATE users 
        SET user_last_login = CURRENT_TIMESTAMP,
            user_login_count = COALESCE(user_login_count, 0) + 1,
            user_failed_login_attempts = 0,
            user_last_failed_login = NULL
        WHERE user_id = $1
        RETURNING *`;

      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getLoginHistory(userId, limit = 10) {
    try {
      const query = `
        SELECT *
        FROM activity_logs
        WHERE log_user_id = $1
        AND log_action IN ('LOGIN', 'LOGIN_FAILED')
        ORDER BY log_createdAt DESC
        LIMIT $2`;

      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateFailedLogin(userId) {
    try {
      const query = `
        UPDATE users 
        SET user_failed_login_attempts = COALESCE(user_failed_login_attempts, 0) + 1,
            user_last_failed_login = CURRENT_TIMESTAMP
        WHERE user_id = $1
        RETURNING *`;

      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
