const pool = require("../config/pool");
const slugify = require("slugify");

class Project {
  static async create(projectData) {
    try {
      const slug = slugify(projectData.project_title, {
        lower: true,
        strict: true,
        locale: "tr",
      });

      const query = `
        INSERT INTO projects
        (project_title, project_slug, project_description, project_owner, 
        project_tags, project_status, project_start_date, project_end_date,
        project_budget, project_createdAt)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`;

      const values = [
        projectData.project_title,
        slug,
        projectData.project_description,
        projectData.project_owner,
        projectData.project_tags || null,
        projectData.project_status || "pending",
        projectData.project_start_date || null,
        projectData.project_end_date || null,
        projectData.project_budget || null,
        new Date(),
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByIdOrSlug(identifier) {
    try {
      const query = `
        SELECT p.*, u.user_name as owner_name
        FROM projects p 
        LEFT JOIN users u ON p.project_owner = u.user_id 
        WHERE p.project_id = $1 OR p.project_slug = $2
      `;

      const result = await pool.query(query, [identifier, identifier]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT p.*, u.user_name as owner_name
        FROM projects p 
        LEFT JOIN users u ON p.project_owner = u.user_id 
        WHERE 1=1
      `;

      const queryParams = [];
      let paramCount = 1;

      if (filters.status) {
        query += ` AND p.project_status = $${paramCount}`;
        queryParams.push(filters.status);
        paramCount++;
      }

      if (filters.owner) {
        query += ` AND p.project_owner = $${paramCount}`;
        queryParams.push(filters.owner);
        paramCount++;
      }

      query += " ORDER BY p.project_createdAt DESC";

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

  static async update(identifier, projectData) {
    try {
      let updateFields = [];
      let queryParams = [];
      let paramCount = 1;

      if (projectData.project_title) {
        updateFields.push(
          `project_title = $${paramCount}`,
          `project_slug = $${paramCount + 1}`
        );
        queryParams.push(
          projectData.project_title,
          slugify(projectData.project_title, {
            lower: true,
            strict: true,
            locale: "tr",
          })
        );
        paramCount += 2;
      }

      [
        "project_description",
        "project_status",
        "project_tags",
        "project_start_date",
        "project_end_date",
        "project_budget",
      ].forEach((field) => {
        if (projectData[field] !== undefined) {
          updateFields.push(`${field} = $${paramCount}`);
          queryParams.push(projectData[field]);
          paramCount++;
        }
      });

      updateFields.push("project_updatedAt = CURRENT_TIMESTAMP");

      queryParams.push(identifier, identifier);

      const query = `
        UPDATE projects 
        SET ${updateFields.join(", ")} 
        WHERE project_id = $${paramCount} OR project_slug = $${paramCount + 1}
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
        "DELETE FROM projects WHERE project_id = $1 OR project_slug = $2 RETURNING *";
      const result = await pool.query(query, [identifier, identifier]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const query = `
        SELECT p.* 
        FROM projects p 
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Project;
