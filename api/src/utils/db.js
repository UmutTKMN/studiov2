const pool = require('../config/pool');
const logger = require('./logger');

/**
 * Veritabanı işlemleri için yardımcı fonksiyonlar
 */
class Database {
    /**
     * Sorgu çalıştırır
     * @param {string} query - SQL sorgusu
     * @param {Array|Object} params - Sorgu parametreleri
     * @returns {Promise<Array>} - Sorgu sonuçları
     */
    static async query(query, params = []) {
        try {
            const [rows] = await pool.execute(query, params);
            return rows;
        } catch (error) {
            logger.error(`DB Sorgu hatası (${query}):`, error);
            throw error;
        }
    }
    
    /**
     * Tek satır döndüren sorgu çalıştırır
     * @param {string} query - SQL sorgusu
     * @param {Array|Object} params - Sorgu parametreleri
     * @returns {Promise<Object|null>} - Sorgu sonucu veya null
     */
    static async queryOne(query, params = []) {
        const rows = await this.query(query, params);
        return rows.length ? rows[0] : null;
    }
    
    /**
     * ID ile kayıt getirir
     * @param {string} table - Tablo adı
     * @param {number|string} id - Kayıt ID
     * @returns {Promise<Object|null>} - Bulunan kayıt veya null
     */
    static async getById(table, id) {
        return await this.queryOne(
            `SELECT * FROM ${table} WHERE id = ?`,
            [id]
        );
    }
    
    /**
     * Belirtilen tablodaki tüm kayıtları sayfalı şekilde getirir
     * @param {string} table - Tablo adı
     * @param {Object} options - Sayfalama, sıralama vb. seçenekler
     * @returns {Promise<Object>} - Kayıtlar ve toplam sayı
     */
    static async paginate(table, options = {}) {
        const {
            page = 1,
            perPage = 10,
            orderBy = 'id',
            order = 'DESC',
            where = '',
            params = []
        } = options;
        
        const offset = (page - 1) * perPage;
        const whereClause = where ? `WHERE ${where}` : '';
        
        // Toplam sayı sorgusu
        const countQuery = `SELECT COUNT(*) as total FROM ${table} ${whereClause}`;
        const [countResult] = await this.query(countQuery, params);
        const total = countResult.total;
        
        // Kayıt sorgusu
        const dataQuery = `
            SELECT * FROM ${table}
            ${whereClause}
            ORDER BY ${orderBy} ${order}
            LIMIT ? OFFSET ?
        `;
        
        const data = await this.query(
            dataQuery, 
            [...params, parseInt(perPage), parseInt(offset)]
        );
        
        return {
            data,
            pagination: {
                total,
                page: parseInt(page),
                perPage: parseInt(perPage),
                totalPages: Math.ceil(total / perPage)
            }
        };
    }
    
    /**
     * Yeni kayıt ekler
     * @param {string} table - Tablo adı
     * @param {Object} data - Eklenecek veri
     * @returns {Promise<Object>} - Eklenen kayıt ID'si ve ilgili bilgiler
     */
    static async insert(table, data) {
        const keys = Object.keys(data);
        const placeholders = keys.map(() => '?').join(', ');
        const values = Object.values(data);
        
        const query = `
            INSERT INTO ${table} (${keys.join(', ')})
            VALUES (${placeholders})
        `;
        
        const result = await this.query(query, values);
        
        return {
            id: result.insertId,
            affectedRows: result.affectedRows,
            success: result.affectedRows > 0
        };
    }
    
    /**
     * Kayıt günceller
     * @param {string} table - Tablo adı
     * @param {number|string} id - Güncellenecek kayıt ID'si
     * @param {Object} data - Güncellenecek veriler
     * @returns {Promise<Object>} - Güncelleme sonucu
     */
    static async update(table, id, data) {
        const keys = Object.keys(data);
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        
        const query = `
            UPDATE ${table}
            SET ${setClause}
            WHERE id = ?
        `;
        
        const result = await this.query(query, values);
        
        return {
            affectedRows: result.affectedRows,
            success: result.affectedRows > 0
        };
    }
    
    /**
     * Kayıt siler
     * @param {string} table - Tablo adı
     * @param {number|string} id - Silinecek kayıt ID'si
     * @returns {Promise<Object>} - Silme sonucu
     */
    static async delete(table, id) {
        const query = `DELETE FROM ${table} WHERE id = ?`;
        const result = await this.query(query, [id]);
        
        return {
            affectedRows: result.affectedRows,
            success: result.affectedRows > 0
        };
    }
    
    /**
     * Transaction başlatır
     * @returns {Promise<Object>} - Transaction nesnesi
     */
    static async beginTransaction() {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        return connection;
    }
    
    /**
     * Transaction'ı commitler
     * @param {Object} connection - Transaction nesnesi
     * @returns {Promise<void>}
     */
    static async commit(connection) {
        await connection.commit();
        connection.release();
    }
    
    /**
     * Transaction'ı geri alır
     * @param {Object} connection - Transaction nesnesi
     * @returns {Promise<void>}
     */
    static async rollback(connection) {
        await connection.rollback();
        connection.release();
    }
}

module.exports = Database;