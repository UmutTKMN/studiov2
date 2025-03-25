const pool = require("../config/pool");
const slugify = require("slugify");

class Category {
  static async create(categoryData) {
    try {
      const slug = slugify(categoryData.category_name, {
        lower: true,
        strict: true,
        locale: "tr",
      });

      const query = `
        INSERT INTO categories
        (category_name, category_slug, category_description, category_createdAt)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;

      const values = [
        categoryData.category_name,
        slug,
        categoryData.category_description || null,
        new Date(),
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const query = `
        SELECT 
          c.*,
          COUNT(p.post_id) as post_count 
        FROM categories c
        LEFT JOIN posts p ON c.category_id = p.post_category
        GROUP BY c.category_id
        ORDER BY c.category_name ASC
      `;

      const result = await pool.query(query);

      const categories = result.rows.map((category) => ({
        id: category.category_id,
        name: category.category_name,
        slug: category.category_slug,
        description: category.category_description,
        post_count: parseInt(category.post_count) || 0,
        created_at: category.category_createdAt,
        updated_at: category.category_updatedAt,
      }));

      return categories;
    } catch (error) {
      throw error;
    }
  }

  static async findByIdOrSlug(identifier) {
    try {
      const query = `
        SELECT 
          c.*,
          COUNT(p.post_id) as post_count 
        FROM categories c
        LEFT JOIN posts p ON c.category_id = p.post_category
        WHERE c.category_id = $1 OR c.category_slug = $2
        GROUP BY c.category_id
      `;

      const result = await pool.query(query, [identifier, identifier]);

      if (result.rows.length === 0) {
        return null;
      }

      const category = {
        id: result.rows[0].category_id,
        name: result.rows[0].category_name,
        slug: result.rows[0].category_slug,
        description: result.rows[0].category_description,
        post_count: parseInt(result.rows[0].post_count) || 0,
        created_at: result.rows[0].category_createdAt,
        updated_at: result.rows[0].category_updatedAt,
      };

      return category;
    } catch (error) {
      throw error;
    }
  }

  static async update(identifier, categoryData) {
    try {
      let updateFields = [];
      let queryParams = [];
      let paramCount = 1;

      if (categoryData.category_name) {
        updateFields.push(
          `category_name = $${paramCount}`,
          `category_slug = $${paramCount + 1}`
        );
        queryParams.push(
          categoryData.category_name,
          slugify(categoryData.category_name, {
            lower: true,
            strict: true,
            locale: "tr",
          })
        );
        paramCount += 2;
      }

      if (categoryData.category_description !== undefined) {
        updateFields.push(`category_description = $${paramCount}`);
        queryParams.push(categoryData.category_description);
        paramCount++;
      }

      updateFields.push("category_updatedAt = CURRENT_TIMESTAMP");

      // WHERE koşulu için parametreler
      queryParams.push(identifier, identifier);

      const query = `
        UPDATE categories 
        SET ${updateFields.join(", ")} 
        WHERE category_id = $${paramCount} OR category_slug = $${paramCount + 1}
        RETURNING *
      `;

      const result = await pool.query(query, queryParams);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(identifier) {
    try {
      const query =
        "DELETE FROM categories WHERE category_id = $1 OR category_slug = $2 RETURNING *";
      const result = await pool.query(query, [identifier, identifier]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Category;
