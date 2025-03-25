const pool = require("../config/pool");

class TicketCategory {
  static async create(categoryData) {
    try {
      // PostgreSQL, SET ? yapisini desteklemez, her alan için parametre belirlemeliyiz
      const fields = Object.keys(categoryData);
      const values = Object.values(categoryData);

      // $1, $2, ... şeklinde parametre yer tutucuları oluştur
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");

      const query = `
        INSERT INTO ticket_categories (${fields.join(", ")}) 
        VALUES (${placeholders})
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll(includeInactive = false) {
    try {
      const query = `
        SELECT * FROM ticket_categories 
        ${!includeInactive ? "WHERE is_active = true" : ""} 
        ORDER BY name ASC
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(categoryId) {
    try {
      const query = `
        SELECT * FROM ticket_categories 
        WHERE category_id = $1
      `;

      const result = await pool.query(query, [categoryId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(categoryId, categoryData) {
    try {
      // PostgreSQL, SET ? yapisini desteklemez, update için parametreleri oluşturmalıyız
      const fields = Object.keys(categoryData);
      const values = Object.values(categoryData);

      // "field1 = $1, field2 = $2, ..." şeklinde set ifadesi oluştur
      const setClause = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(", ");

      const query = `
        UPDATE ticket_categories 
        SET ${setClause} 
        WHERE category_id = $${fields.length + 1}
        RETURNING *
      `;

      const result = await pool.query(query, [...values, categoryId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(categoryId) {
    try {
      const query = `
        UPDATE ticket_categories 
        SET is_active = false 
        WHERE category_id = $1
        RETURNING *
      `;

      const result = await pool.query(query, [categoryId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TicketCategory;
