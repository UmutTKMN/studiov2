const mysql = require("mysql");
const config = require("../config/config");

const pool = mysql.createPool(config.db);

class TicketMessage {
  static async create(messageData) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ticket_messages SET ?`;
      pool.query(query, messageData, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async findByTicketId(ticketId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT m.*, u.user_name, u.user_profileImage
        FROM ticket_messages m
        JOIN users u ON m.user_id = u.user_id
        WHERE m.ticket_id = ?
        ORDER BY m.created_at ASC`;
      
      pool.query(query, [ticketId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async markAsRead(messageId, userId) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE ticket_messages SET is_read = true WHERE message_id = ? AND user_id != ?`;
      pool.query(query, [messageId, userId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }
}

module.exports = TicketMessage;