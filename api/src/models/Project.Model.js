const mysql = require("mysql");
const config = require("../config/config");
const slugify = require('slugify');

const pool = mysql.createPool(config.db);

class Project {
  static async create(projectData) {
    return new Promise((resolve, reject) => {
      const slug = slugify(projectData.project_title, { lower: true, strict: true });
      
      const query = `
        INSERT INTO projects (
          project_title, project_slug, project_description, 
          project_owner, project_tags, project_status,
          project_start_date, project_end_date, project_budget,
          project_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      pool.query(
        query,
        [
          projectData.project_title,
          slug,
          projectData.project_description,
          projectData.project_owner,
          projectData.project_tags || null,
          projectData.project_status || 'pending',
          projectData.project_start_date || null,
          projectData.project_end_date || null,
          projectData.project_budget || null,
          projectData.project_image || null
        ],
        (error, results) => {
          if (error) {
            console.error('Project creation error:', error);
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, 
               u.user_name as owner_name, 
               u.user_profileImage as owner_image
        FROM projects p 
        LEFT JOIN users u ON p.project_owner = u.user_id 
        WHERE p.project_id = ?`;

      pool.query(query, [id], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }

  static async findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT p.*, 
               u.user_name as owner_name, 
               u.user_profileImage as owner_image
        FROM projects p 
        LEFT JOIN users u ON p.project_owner = u.user_id 
        WHERE 1=1`;

      const queryParams = [];

      if (filters.status) {
        query += " AND p.project_status = ?";
        queryParams.push(filters.status);
      }

      if (filters.owner) {
        query += " AND p.project_owner = ?";
        queryParams.push(filters.owner);
      }

      if (filters.search) {
        query += " AND (p.project_title LIKE ? OR p.project_description LIKE ? OR p.project_tags LIKE ?)";
        const searchTerm = `%${filters.search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }

      // Date range filter
      if (filters.startDate) {
        query += " AND p.project_start_date >= ?";
        queryParams.push(filters.startDate);
      }

      if (filters.endDate) {
        query += " AND p.project_end_date <= ?";
        queryParams.push(filters.endDate);
      }

      query += " ORDER BY p.project_createdAt DESC";

      console.log('Query:', query); // Debug için
      console.log('Params:', queryParams); // Debug için

      pool.query(query, queryParams, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async update(id, projectData) {
    return new Promise((resolve, reject) => {
      let updateFields = [];
      let queryParams = [];

      if (projectData.project_title) {
        updateFields.push('project_title = ?');
        queryParams.push(projectData.project_title);
        
        updateFields.push('project_slug = ?');
        queryParams.push(slugify(projectData.project_title, { lower: true, strict: true }));
      }

      const updatableFields = [
        'project_description', 'project_status', 'project_tags',
        'project_start_date', 'project_end_date', 'project_budget',
        'project_image'
      ];

      updatableFields.forEach(field => {
        if (projectData[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          queryParams.push(projectData[field]);
        }
      });

      queryParams.push(id);

      const query = `UPDATE projects SET ${updateFields.join(', ')} WHERE project_id = ?`;
      
      pool.query(query, queryParams, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      // project_id kullan
      const query = "DELETE FROM projects WHERE project_id = ?";
      
      console.log('Delete query:', query, 'with id:', id); // Debug için
      
      pool.query(query, [id], (error, results) => {
        if (error) {
          console.error('Delete error:', error);
          return reject(error);
        }
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
