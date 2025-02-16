const mysql = require('mysql');
const config = require('../config/config');

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
          logData.log_description
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

  static async getRecentActivity(limit = 10) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT al.*, u.user_name
        FROM activity_logs al
        LEFT JOIN users u ON al.log_user_id = u.user_id
        ORDER BY al.log_createdAt DESC
        LIMIT ?`;

      pool.query(query, [limit], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }
}

module.exports = ActivityLog;
