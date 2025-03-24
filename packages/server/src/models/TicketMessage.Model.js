const pool = require("../config/pool");

class TicketMessage {
  static async create(messageData) {
    try {
      // PostgreSQL, SET ? yapisini desteklemez, her alan için parametre belirlemeliyiz
      const fields = Object.keys(messageData);
      const values = Object.values(messageData);

      // $1, $2, ... şeklinde parametre yer tutucuları oluştur
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");

      const query = `
        INSERT INTO ticket_messages (${fields.join(", ")})
        VALUES (${placeholders})
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByTicketId(ticketId) {
    try {
      const query = `
        SELECT m.*, u.user_name, u.user_profileImage
        FROM ticket_messages m
        JOIN users u ON m.user_id = u.user_id
        WHERE m.ticket_id = $1
        ORDER BY m.created_at ASC`;

      const result = await pool.query(query, [ticketId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async markAsRead(messageId, userId) {
    try {
      const query = `
        UPDATE ticket_messages 
        SET is_read = true 
        WHERE message_id = $1 AND user_id != $2
        RETURNING *`;

      const result = await pool.query(query, [messageId, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TicketMessage;
