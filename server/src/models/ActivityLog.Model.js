const mysql = require("mysql");
const config = require("../config/config");

const pool = mysql.createPool(config.db);

class ActivityLog {
  static async create(logData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO activity_logs (
          log_user_id, log_action, log_table, 
          log_record_id, log_description
        ) VALUES (?, ?, ?, ?, ?)`;

      pool.query(
        query,
        [
          logData.log_user_id,
          logData.log_action,
          logData.log_table,
          logData.log_record_id,
          logData.log_description,
        ],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  static async findByUserId(userId, limit = 10) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT al.*, u.user_name
        FROM activity_logs al
        LEFT JOIN users u ON al.log_user_id = u.user_id
        WHERE al.log_user_id = ?
        ORDER BY al.log_createdAt DESC
        LIMIT ?`;

      pool.query(query, [userId, limit], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async findByTable(tableName, limit = 10) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT al.*, u.user_name
        FROM activity_logs al
        LEFT JOIN users u ON al.log_user_id = u.user_id
        WHERE al.log_table = ?
        ORDER BY al.log_createdAt DESC
        LIMIT ?`;

      pool.query(query, [tableName, limit], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async getRecentActivity(page = 1, limit = 20, filters = {}) {
    return new Promise((resolve, reject) => {
      try {
        const offset = (page - 1) * limit;
        const params = [];
        const conditions = [];

        // Arama filtresi
        if (filters.search && filters.search.trim() !== '') {
          const searchValue = `%${filters.search.trim()}%`;
          conditions.push(`(
            al.log_description LIKE ? OR 
            u.user_name LIKE ? OR 
            al.log_table LIKE ? OR 
            al.log_action LIKE ?
          )`);
          params.push(searchValue, searchValue, searchValue, searchValue);
        }

        // Diğer filtreler
        if (filters.action) {
          conditions.push('al.log_action = ?');
          params.push(filters.action);
        }

        if (filters.table) {
          conditions.push('al.log_table = ?');
          params.push(filters.table);
        }

        const whereClause = conditions.length > 0 
          ? `WHERE ${conditions.join(' AND ')}`
          : '';

        const sortOrder = filters.sortBy === 'asc' ? 'ASC' : 'DESC';

        // Toplam kayıt sayısını al
        const countQuery = `
          SELECT COUNT(*) as total 
          FROM activity_logs al
          LEFT JOIN users u ON al.log_user_id = u.user_id
          ${whereClause}
        `;

        // Verileri getir
        const dataQuery = `
          SELECT al.*, u.user_name
          FROM activity_logs al
          LEFT JOIN users u ON al.log_user_id = u.user_id
          ${whereClause}
          ORDER BY al.log_createdAt ${sortOrder}
          LIMIT ? OFFSET ?
        `;

        // Önce toplam kayıt sayısını al
        pool.query(countQuery, params, (error, countResult) => {
          if (error) {
            console.error('Count query error:', error);
            reject(error);
            return;
          }

          // Sonra verileri getir
          pool.query(
            dataQuery, 
            [...params, parseInt(limit), parseInt(offset)],
            (error, results) => {
              if (error) {
                console.error('Data query error:', error);
                reject(error);
                return;
              }

              const total = countResult[0].total;
              
              resolve({
                data: results,
                pagination: {
                  total: total,
                  currentPage: parseInt(page),
                  totalPages: Math.ceil(total / limit),
                  limit: parseInt(limit)
                }
              });
            }
          );
        });

      } catch (error) {
        console.error('getRecentActivity error:', error);
        reject(error);
      }
    });
  }
}

module.exports = ActivityLog;
