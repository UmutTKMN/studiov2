const mysql = require("mysql");
const config = require("../config/config");
const slugify = require('slugify');

const pool = mysql.createPool(config.db);

class Project {
  static async create(projectData) {
    return new Promise((resolve, reject) => {
      const slug = slugify(projectData.project_title, { 
        lower: true, 
        strict: true,
        locale: 'tr'
      });
      
      const query = `
        INSERT INTO projects SET ?
      `;

      const insertData = {
        project_title: projectData.project_title,
        project_slug: slug,
        project_description: projectData.project_description,
        project_owner: projectData.project_owner,
        project_tags: projectData.project_tags || null,
        project_status: projectData.project_status || 'pending',
        project_start_date: projectData.project_start_date || null,
        project_end_date: projectData.project_end_date || null,
        project_budget: projectData.project_budget || null,
        project_createdAt: new Date()
      };

      pool.query(query, insertData, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async findByIdOrSlug(identifier) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, u.user_name as owner_name
        FROM projects p 
        LEFT JOIN users u ON p.project_owner = u.user_id 
        WHERE p.project_id = ? OR p.project_slug = ?
      `;

      pool.query(query, [identifier, identifier], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }

  static async findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT p.*, u.user_name as owner_name
        FROM projects p 
        LEFT JOIN users u ON p.project_owner = u.user_id 
        WHERE 1=1
      `;

      const queryParams = [];

      if (filters.status) {
        query += " AND p.project_status = ?";
        queryParams.push(filters.status);
      }

      if (filters.owner) {
        query += " AND p.project_owner = ?";
        queryParams.push(filters.owner);
      }

      query += " ORDER BY p.project_createdAt DESC";

      if (filters.limit) {
        query += " LIMIT ?";
        queryParams.push(parseInt(filters.limit));
      }

      pool.query(query, queryParams, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async update(identifier, projectData) {
    return new Promise((resolve, reject) => {
      let updateFields = [];
      let queryParams = [];

      if (projectData.project_title) {
        updateFields.push('project_title = ?', 'project_slug = ?');
        queryParams.push(
          projectData.project_title,
          slugify(projectData.project_title, { lower: true, strict: true, locale: 'tr' })
        );
      }

      ['project_description', 'project_status', 'project_tags', 
       'project_start_date', 'project_end_date', 'project_budget']
        .forEach(field => {
          if (projectData[field] !== undefined) {
            updateFields.push(`${field} = ?`);
            queryParams.push(projectData[field]);
          }
        });

      updateFields.push('project_updatedAt = CURRENT_TIMESTAMP');
      queryParams.push(identifier, identifier);

      const query = `
        UPDATE projects 
        SET ${updateFields.join(', ')} 
        WHERE project_id = ? OR project_slug = ?
      `;
      
      pool.query(query, queryParams, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async delete(identifier) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM projects WHERE project_id = ? OR project_slug = ?";
      pool.query(query, [identifier, identifier], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.* 
        FROM projects p 
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
      `;
      pool.query(query, [userId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }
}

module.exports = Project;
