const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('@config');
const logger = require('./logger');

/**
 * Güvenlik ile ilgili yardımcı fonksiyonlar
 */
class Security {
    /**
     * SHA-256 hash oluşturur
     * @param {string} data - Hash'lenecek veri
     * @returns {string} - Hash değeri
     */
    static createHash(data) {
        return crypto.createHash('sha256').update(String(data)).digest('hex');
    }
    
    /**
     * Rastgele token oluşturur
     * @param {number} byteSize - Token byte boyutu
     * @returns {string} - Hex formatında token
     */
    static generateRandomToken(byteSize = 32) {
        return crypto.randomBytes(byteSize).toString('hex');
    }
    
    /**
     * JWT token oluşturur
     * @param {Object} payload - Token payload
     * @param {string} expiresIn - Geçerlilik süresi
     * @returns {string} - JWT token
     */
    static generateJWT(payload, expiresIn = config.jwt.expiresIn) {
        try {
            return jwt.sign(payload, config.jwt.secret, { expiresIn });
        } catch (error) {
            logger.error('JWT oluşturma hatası:', error);
            throw new Error('Token oluşturulamadı');
        }
    }
    
    /**
     * JWT token doğrular
     * @param {string} token - JWT token
     * @returns {Object} - Decoded payload veya null
     */
    static verifyJWT(token) {
        try {
            return jwt.verify(token, config.jwt.secret);
        } catch (error) {
            logger.error('JWT doğrulama hatası:', error.message);
            return null;
        }
    }
    
    /**
     * Şifre hashleme
     * @param {string} password - Ham şifre
     * @param {string} salt - Salt değeri (opsiyonel)
     * @returns {Object} - Hash ve salt değerleri
     */
    static hashPassword(password, salt = null) {
        try {
            const useSalt = salt || crypto.randomBytes(16).toString('hex');
            const hash = crypto.pbkdf2Sync(password, useSalt, 10000, 64, 'sha512').toString('hex');
            
            return { hash, salt: useSalt };
        } catch (error) {
            logger.error('Şifre hashleme hatası:', error);
            throw new Error('Şifre hashlenemedi');
        }
    }
    
    /**
     * Şifre doğrulama
     * @param {string} password - Kontrol edilecek şifre
     * @param {string} hash - Kaydedilmiş hash
     * @param {string} salt - Kaydedilmiş salt
     * @returns {boolean} - Eşleşme durumu
     */
    static verifyPassword(password, hash, salt) {
        try {
            const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
            return hashedPassword === hash;
        } catch (error) {
            logger.error('Şifre doğrulama hatası:', error);
            return false;
        }
    }
    
    /**
     * Anti-CSRF token oluşturur
     * @returns {string} - CSRF token
     */
    static generateCSRFToken() {
        return this.generateRandomToken(32);
    }
    
    /**
     * IP adresini maskeleyerek loglar
     * @param {string} ip - IP adresi
     * @returns {string} - Maskelenmiş IP
     */
    static maskIP(ip) {
        if (!ip) return 'unknown';
        // IPv4
        if (ip.includes('.')) {
            const parts = ip.split('.');
            return `${parts[0]}.${parts[1]}.xxx.xxx`;
        }
        // IPv6
        if (ip.includes(':')) {
            const parts = ip.split(':');
            return `${parts[0]}:${parts[1]}:xxxx:xxxx:xxxx:xxxx`;
        }
        return 'unknown';
    }
}

module.exports = Security;