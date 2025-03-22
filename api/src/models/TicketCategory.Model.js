const mysql = require("mysql");
const config = require("../config/config");

const pool = mysql.createPool(config.db);

class TicketCategory {
  static async create(categoryData) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ticket_categories SET ?`;
      pool.query(query, categoryData, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async findAll(includeInactive = false) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ticket_categories ${!includeInactive ? 'WHERE is_active = true' : ''} ORDER BY name ASC`;
      pool.query(query, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async findById(categoryId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ticket_categories WHERE category_id = ?`;
      pool.query(query, [categoryId], (error, results) => {
        if (error) reject(error);
        resolve(results[0]);
      });
    });
  }

  static async update(categoryId, categoryData) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE ticket_categories SET ? WHERE category_id = ?`;
      pool.query(query, [categoryData, categoryId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }

  static async delete(categoryId) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE ticket_categories SET is_active = false WHERE category_id = ?`;
      pool.query(query, [categoryId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }
}

module.exports = TicketCategory;