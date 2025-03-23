const pool = require("../config/pool");

class Ticket {
  static async create(ticketData) {
    try {
      // PostgreSQL, SET ? yapisini desteklemez, her alan için parametre belirlemeliyiz
      const fields = Object.keys(ticketData);
      const values = Object.values(ticketData);

      // $1, $2, ... şeklinde parametre yer tutucuları oluştur
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");

      const query = `
        INSERT INTO support_tickets (${fields.join(", ")})
        VALUES (${placeholders})
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
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
      let paramCount = 1;

      if (filters.status) {
        whereConditions.push(`t.status = $${paramCount}`);
        queryParams.push(filters.status);
        paramCount++;
      }

      if (filters.category_id) {
        whereConditions.push(`t.category_id = $${paramCount}`);
        queryParams.push(filters.category_id);
        paramCount++;
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(" AND ")}`;
      }

      query += ` GROUP BY t.ticket_id, u.user_name, u.user_email, a.user_name, c.name ORDER BY t.created_at DESC`;

      if (filters.limit) {
        query += ` LIMIT $${paramCount}`;
        queryParams.push(parseInt(filters.limit));
      }

      const result = await pool.query(query, queryParams);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(ticketId, userId = null) {
    try {
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
        WHERE t.ticket_id = $1 ${userId ? "AND t.user_id = $2" : ""}`;

      const params = userId ? [ticketId, userId] : [ticketId];
      const result = await pool.query(query, params);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findUserTickets(userId, filters = {}) {
    try {
      let query = `
        SELECT t.*, 
               c.name as category_name,
               COUNT(m.message_id) as message_count,
               MAX(m.created_at) as last_message_date
        FROM support_tickets t
        LEFT JOIN ticket_categories c ON t.category_id = c.category_id
        LEFT JOIN ticket_messages m ON t.ticket_id = m.ticket_id
        WHERE t.user_id = $1`;

      const queryParams = [userId];
      let paramCount = 2;

      if (filters.status) {
        query += ` AND t.status = $${paramCount}`;
        queryParams.push(filters.status);
        paramCount++;
      }

      if (filters.category_id) {
        query += ` AND t.category_id = $${paramCount}`;
        queryParams.push(filters.category_id);
        paramCount++;
      }

      query += ` GROUP BY t.ticket_id, c.name ORDER BY t.created_at DESC`;

      if (filters.limit) {
        query += ` LIMIT $${paramCount}`;
        queryParams.push(parseInt(filters.limit));
      }

      const result = await pool.query(query, queryParams);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getMessages(ticketId, userId = null) {
    try {
      const query = `
        SELECT m.*, 
               u.user_name,
               u.user_profileImage
        FROM ticket_messages m
        JOIN users u ON m.user_id = u.user_id
        JOIN support_tickets t ON m.ticket_id = t.ticket_id
        WHERE m.ticket_id = $1 ${userId ? "AND t.user_id = $2" : ""}
        ORDER BY m.created_at ASC`;

      const params = userId ? [ticketId, userId] : [ticketId];
      const result = await pool.query(query, params);

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async addMessage(messageData) {
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

  static async updateStatus(ticketId, status, userId = null) {
    try {
      const query = `
        UPDATE support_tickets 
        SET status = $1 
        WHERE ticket_id = $2 ${userId ? "AND user_id = $3" : ""}
        RETURNING *`;

      const params = userId ? [status, ticketId, userId] : [status, ticketId];
      const result = await pool.query(query, params);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async assignStaff(ticketId, staffId) {
    try {
      const query = `
        UPDATE support_tickets 
        SET assigned_to = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE ticket_id = $2
        RETURNING *`;

      const result = await pool.query(query, [staffId, ticketId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateLastActivity(ticketId) {
    try {
      const query = `
        UPDATE support_tickets 
        SET updated_at = CURRENT_TIMESTAMP 
        WHERE ticket_id = $1
        RETURNING *`;

      const result = await pool.query(query, [ticketId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getCategories() {
    try {
      const query = `
        SELECT category_id, name, description 
        FROM ticket_categories 
        WHERE is_active = true 
        ORDER BY name ASC`;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getCategoryById(categoryId) {
    try {
      const query = `
        SELECT category_id, name, description 
        FROM ticket_categories 
        WHERE category_id = $1 AND is_active = true`;

      const result = await pool.query(query, [categoryId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Ticket;
