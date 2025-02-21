const mysql = require('mysql');
const config = require('../config/config');

const pool = mysql.createPool(config.db);

class Role {
    static async create(roleData) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO roles (role_name, role_description) VALUES (?, ?)';
            pool.query(
                query,
                [roleData.role_name, roleData.role_description],
                (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT * FROM roles WHERE role_id = ?',
                [id],
                (error, results) => {
                    if (error) reject(error);
                    resolve(results[0]);
                }
            );
        });
    }

    static async findByName(name) {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT * FROM roles WHERE name = ?',
                [name],
                (error, results) => {
                    if (error) reject(error);
                    resolve(results[0]);
                }
            );
        });
    }

    static async findAll() {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT * FROM roles ORDER BY name ASC',
                (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        });
    }

    static async update(id, roleData) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE roles SET name = ?, description = ? WHERE id = ?';
            pool.query(
                query,
                [roleData.name, roleData.description, id],
                (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM roles WHERE id = ?', [id], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    static async assignToUser(userId, roleId) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET user_role = ? WHERE user_id = ?';
            pool.query(query, [roleId, userId], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    static async getUserRole(userId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT r.* 
                FROM roles r 
                JOIN users u ON u.user_role = r.role_id 
                WHERE u.user_id = ?
            `;
            pool.query(query, [userId], (error, results) => {
                if (error) reject(error);
                resolve(results[0]);
            });
        });
    }
}

module.exports = Role;