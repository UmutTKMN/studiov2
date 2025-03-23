const pool = require("../config/pool");

class Role {
  static async create(roleData) {
    try {
      const query = `
        INSERT INTO roles
        (role_name, role_description, role_createdAt)
        VALUES ($1, $2, $3)
        RETURNING *`;

      const values = [roleData.name, roleData.description, new Date()];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByIdOrName(identifier) {
    try {
      const query = `
        SELECT * FROM roles 
        WHERE role_id = $1 OR role_name = $2
      `;

      const result = await pool.query(query, [identifier, identifier]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const query = `
        SELECT r.*, 
               COUNT(u.user_id) as user_count
        FROM roles r
        LEFT JOIN users u ON r.role_id = u.user_role
        GROUP BY r.role_id
        ORDER BY r.role_name ASC
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(identifier, roleData) {
    try {
      const updateFields = [];
      const queryParams = [];
      let paramCount = 1;

      if (roleData.name) {
        updateFields.push(`role_name = $${paramCount}`);
        queryParams.push(roleData.name);
        paramCount++;
      }

      if (roleData.description !== undefined) {
        updateFields.push(`role_description = $${paramCount}`);
        queryParams.push(roleData.description);
        paramCount++;
      }

      updateFields.push("role_updatedAt = CURRENT_TIMESTAMP");

      // WHERE koşulu için parametreler
      queryParams.push(identifier, identifier);

      const query = `
        UPDATE roles 
        SET ${updateFields.join(", ")} 
        WHERE role_id = $${paramCount} OR role_name = $${paramCount + 1}
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
      const query = `
        DELETE FROM roles 
        WHERE role_id = $1 OR role_name = $2
        RETURNING *
      `;

      const result = await pool.query(query, [identifier, identifier]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async assignToUser(userId, roleId) {
    try {
      const query = `
        UPDATE users 
        SET user_role = $1, 
            user_updatedAt = CURRENT_TIMESTAMP 
        WHERE user_id = $2
        RETURNING *
      `;

      const result = await pool.query(query, [roleId, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getUserRole(userId) {
    try {
      const query = `
        SELECT r.* 
        FROM roles r 
        JOIN users u ON u.user_role = r.role_id 
        WHERE u.user_id = $1
      `;

      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Role;
