const pool = require("../config/pool");

class ActivityLog {
  static async create(logData) {
    try {
      const query = `
        INSERT INTO activity_logs (
          log_user_id, log_action, log_table, 
          log_record_id, log_description
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;

      const values = [
        logData.log_user_id,
        logData.log_action,
        logData.log_table,
        logData.log_record_id,
        logData.log_description,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId, limit = 10) {
    try {
      const query = `
        SELECT al.*, u.user_name
        FROM activity_logs al
        LEFT JOIN users u ON al.log_user_id = u.user_id
        WHERE al.log_user_id = $1
        ORDER BY al.log_createdAt DESC
        LIMIT $2`;

      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByTable(tableName, limit = 10) {
    try {
      const query = `
        SELECT al.*, u.user_name
        FROM activity_logs al
        LEFT JOIN users u ON al.log_user_id = u.user_id
        WHERE al.log_table = $1
        ORDER BY al.log_createdAt DESC
        LIMIT $2`;

      const result = await pool.query(query, [tableName, limit]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getRecentActivity(page = 1, limit = 20, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      const params = [];
      const conditions = [];
      let paramCounter = 1;

      // Arama filtresi
      if (filters.search && filters.search.trim() !== "") {
        const searchValue = `%${filters.search.trim()}%`;
        conditions.push(`(
          al.log_description LIKE $${paramCounter} OR 
          u.user_name LIKE $${paramCounter + 1} OR 
          al.log_table LIKE $${paramCounter + 2} OR 
          al.log_action LIKE $${paramCounter + 3}
        )`);
        params.push(searchValue, searchValue, searchValue, searchValue);
        paramCounter += 4;
      }

      // Diğer filtreler
      if (filters.action) {
        conditions.push(`al.log_action = $${paramCounter}`);
        params.push(filters.action);
        paramCounter++;
      }

      if (filters.table) {
        conditions.push(`al.log_table = $${paramCounter}`);
        params.push(filters.table);
        paramCounter++;
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const sortOrder = filters.sortBy === "asc" ? "ASC" : "DESC";

      // Toplam kayıt sayısını al
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM activity_logs al
        LEFT JOIN users u ON al.log_user_id = u.user_id
        ${whereClause}
      `;

      // Önce toplam kayıt sayısını al
      const countResult = await pool.query(countQuery, params);

      // Verileri getir
      const dataQuery = `
        SELECT al.*, u.user_name
        FROM activity_logs al
        LEFT JOIN users u ON al.log_user_id = u.user_id
        ${whereClause}
        ORDER BY al.log_createdAt ${sortOrder}
        LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
      `;

      const dataResult = await pool.query(dataQuery, [
        ...params,
        parseInt(limit),
        parseInt(offset),
      ]);

      const total = parseInt(countResult.rows[0].total);

      return {
        data: dataResult.rows,
        pagination: {
          total: total,
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      };
    } catch (error) {
      console.error("getRecentActivity error:", error);
      throw error;
    }
  }
}

module.exports = ActivityLog;
