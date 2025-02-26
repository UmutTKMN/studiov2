const mysql = require("mysql");
const config = require("../config/config");

const pool = mysql.createPool(config.db);

class Ticket {
  static async create(ticketData) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO support_tickets SET ?`;
      pool.query(query, ticketData, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `SELECT t.*,
                            u.user_name as creator_name,
                            u.user_email as creator_email,
                            a.user_name as assigned_name,
                            c.name as category_name,
                            COUNT(m.message_id) as message_count,
                            MAX(m.created_at) as last_message_date
                        FROM support_tickets t
                        LEFT JOIN users u ON t.user_id = u.user_id
                        LEFT JOIN users a ON t.assigned_to = a.user_id
                        LEFT JOIN ticket_categories c ON t.category_id = c.category_id
                        LEFT JOIN ticket_messages m ON t.ticket_id = m.ticket_id`;

      const queryParams = [];
      const whereConditions = [];

      if (filters.status) {
        whereConditions.push("t.status = ?");
        queryParams.push(filters.status);
      }

      if (filters.category_id) {
        whereConditions.push("t.category_id = ?");
        queryParams.push(filters.category_id);
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      query += ` GROUP BY t.ticket_id ORDER BY t.created_at DESC`;

      if (filters.limit) {
        query += ` LIMIT ?`;
        queryParams.push(parseInt(filters.limit));
      }

      pool.query(query, queryParams, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async findById(ticketId, userId = null) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.*, 
               u.user_name as creator_name,
               u.user_email as creator_email,
               a.user_name as assigned_name,
               c.name as category_name,
               c.description as category_description
        FROM support_tickets t
        LEFT JOIN users u ON t.user_id = u.user_id
        LEFT JOIN users a ON t.assigned_to = a.user_id
        LEFT JOIN ticket_categories c ON t.category_id = c.category_id
        WHERE t.ticket_id = ? ${userId ? "AND t.user_id = ?" : ""}`;

      pool.query(
        query,
        userId ? [ticketId, userId] : [ticketId],
        (error, results) => {
          if (error) reject(error);
          resolve(results[0]);
        }
      );
    });
  }

  static async findUserTickets(userId, filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT t.*, 
               c.name as category_name,
               COUNT(m.message_id) as message_count,
               MAX(m.created_at) as last_message_date
        FROM support_tickets t
        LEFT JOIN ticket_categories c ON t.category_id = c.category_id
        LEFT JOIN ticket_messages m ON t.ticket_id = m.ticket_id
        WHERE t.user_id = ?`;

      const queryParams = [userId];

      if (filters.status) {
        query += ` AND t.status = ?`;
        queryParams.push(filters.status);
      }

      if (filters.category_id) {
        query += ` AND t.category_id = ?`;
        queryParams.push(filters.category_id);
      }

      query += ` GROUP BY t.ticket_id ORDER BY t.created_at DESC`;

      if (filters.limit) {
        query += ` LIMIT ?`;
        queryParams.push(parseInt(filters.limit));
      }

      pool.query(query, queryParams, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async getMessages(ticketId, userId = null) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT m.*, 
               u.user_name,
               u.user_profileImage
        FROM ticket_messages m
        JOIN users u ON m.user_id = u.user_id
        JOIN support_tickets t ON m.ticket_id = t.ticket_id
        WHERE m.ticket_id = ? ${userId ? "AND t.user_id = ?" : ""}
        ORDER BY m.created_at ASC`;

      pool.query(
        query,
        userId ? [ticketId, userId] : [ticketId],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  static async addMessage(messageData) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ticket_messages SET ?`;
      pool.query(query, messageData, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async updateStatus(ticketId, status, userId = null) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE support_tickets 
        SET status = ? 
        WHERE ticket_id = ? ${userId ? "AND user_id = ?" : ""}`;

      pool.query(
        query,
        userId ? [status, ticketId, userId] : [status, ticketId],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  static async assignStaff(ticketId, staffId) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE support_tickets 
        SET assigned_to = ?, updated_at = NOW() 
        WHERE ticket_id = ?`;
        
      pool.query(query, [staffId, ticketId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async updateLastActivity(ticketId) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE support_tickets SET updated_at = NOW() WHERE ticket_id = ?`;
      pool.query(query, [ticketId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async getCategories() {
    return new Promise((resolve, reject) => {
      const query = `SELECT category_id, name, description FROM ticket_categories WHERE is_active = true ORDER BY name ASC`;
      pool.query(query, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }
  
  static async getCategoryById(categoryId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT category_id, name, description FROM ticket_categories WHERE category_id = ? AND is_active = true`;
      pool.query(query, [categoryId], (error, results) => {
        if (error) reject(error);
        resolve(results[0]);
      });
    });
  }
}

module.exports = Ticket;
