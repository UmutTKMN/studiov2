const mysql = require("mysql");
const config = require("../config/config");

const pool = mysql.createPool(config.db);

class Role {
  static async create(roleData) {
    return new Promise((resolve, reject) => {
      const query = `
                INSERT INTO roles SET ?
            `;

      pool.query(
        query,
        {
          role_name: roleData.name,
          role_description: roleData.description,
          role_createdAt: new Date(),
        },
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  static async findByIdOrName(identifier) {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT * FROM roles 
                WHERE role_id = ? OR role_name = ?
            `;

      pool.query(query, [identifier, identifier], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }

  static async findAll() {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT r.*, 
                       COUNT(u.user_id) as user_count
                FROM roles r
                LEFT JOIN users u ON r.role_id = u.user_role
                GROUP BY r.role_id
                ORDER BY r.role_name ASC
            `;

      pool.query(query, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async update(identifier, roleData) {
    return new Promise((resolve, reject) => {
      const updateFields = [];
      const queryParams = [];

      if (roleData.name) {
        updateFields.push("role_name = ?");
        queryParams.push(roleData.name);
      }

      if (roleData.description !== undefined) {
        updateFields.push("role_description = ?");
        queryParams.push(roleData.description);
      }

      updateFields.push("role_updatedAt = CURRENT_TIMESTAMP");
      queryParams.push(identifier, identifier);

      const query = `
                UPDATE roles 
                SET ${updateFields.join(", ")} 
                WHERE role_id = ? OR role_name = ?
            `;

      pool.query(query, queryParams, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async delete(identifier) {
    return new Promise((resolve, reject) => {
      const query = `
                DELETE FROM roles 
                WHERE role_id = ? OR role_name = ?
            `;

      pool.query(query, [identifier, identifier], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async assignToUser(userId, roleId) {
    return new Promise((resolve, reject) => {
      const query = `
                UPDATE users 
                SET user_role = ?, 
                    user_updatedAt = CURRENT_TIMESTAMP 
                WHERE user_id = ?
            `;

      pool.query(query, [roleId, userId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async getUserRole(userId) {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT r.* 
                FROM roles r 
                JOIN users u ON u.user_role = r.role_id 
                WHERE u.user_id = ?
            `;

      pool.query(query, [userId], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }
}

module.exports = Role;
