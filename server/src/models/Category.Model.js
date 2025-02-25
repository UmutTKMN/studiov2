const mysql = require("mysql");
const config = require("../config/config");
const slugify = require("slugify");

const pool = mysql.createPool(config.db);

class Category {
  static async create(categoryData) {
    return new Promise((resolve, reject) => {
      const slug = slugify(categoryData.category_name, {
        lower: true,
        strict: true,
        locale: "tr",
      });

      const insertData = {
        category_name: categoryData.category_name,
        category_slug: slug,
        category_description: categoryData.category_description || null,
        category_createdAt: new Date(),
      };

      pool.query(
        "INSERT INTO categories SET ?",
        insertData,
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  static async findAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c.*,
          COUNT(p.post_id) as post_count 
        FROM categories c
        LEFT JOIN posts p ON c.category_id = p.post_category
        GROUP BY c.category_id
        ORDER BY c.category_name ASC
      `;

      pool.query(query, (error, results) => {
        if (error) return reject(error);

        const categories =
          results?.map((category) => ({
            id: category.category_id,
            name: category.category_name,
            slug: category.category_slug,
            description: category.category_description,
            post_count: category.post_count || 0,
            created_at: category.category_createdAt,
            updated_at: category.category_updatedAt,
          })) || [];

        resolve(categories);
      });
    });
  }

  static async findByIdOrSlug(identifier) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c.*,
          COUNT(p.post_id) as post_count 
        FROM categories c
        LEFT JOIN posts p ON c.category_id = p.post_category
        WHERE c.category_id = ? OR c.category_slug = ?
        GROUP BY c.category_id
      `;

      pool.query(query, [identifier, identifier], (error, results) => {
        if (error) return reject(error);

        const category = results?.[0]
          ? {
              id: results[0].category_id,
              name: results[0].category_name,
              slug: results[0].category_slug,
              description: results[0].category_description,
              post_count: results[0].post_count || 0,
              created_at: results[0].category_createdAt,
              updated_at: results[0].category_updatedAt,
            }
          : null;

        resolve(category);
      });
    });
  }

  static async update(identifier, categoryData) {
    return new Promise((resolve, reject) => {
      let updateFields = [];
      let queryParams = [];

      if (categoryData.category_name) {
        updateFields.push("category_name = ?", "category_slug = ?");
        queryParams.push(
          categoryData.category_name,
          slugify(categoryData.category_name, {
            lower: true,
            strict: true,
            locale: "tr",
          })
        );
      }

      if (categoryData.category_description !== undefined) {
        updateFields.push("category_description = ?");
        queryParams.push(categoryData.category_description);
      }

      updateFields.push("category_updatedAt = CURRENT_TIMESTAMP");
      queryParams.push(identifier, identifier);

      const query = `
        UPDATE categories 
        SET ${updateFields.join(", ")} 
        WHERE category_id = ? OR category_slug = ?
      `;

      pool.query(query, queryParams, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async delete(identifier) {
    return new Promise((resolve, reject) => {
      const query =
        "DELETE FROM categories WHERE category_id = ? OR category_slug = ?";
      pool.query(query, [identifier, identifier], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }
}

module.exports = Category;
