/**
 * Veri doğrulama ve sanitizasyon için yardımcı fonksiyonlar
 */
const xss = require('xss');
const { isEmail } = require('validator');
const logger = require('./logger');

class Validator {
    /**
     * XSS koruması için veriyi temizler
     * @param {any} data - Temizlenecek veri
     * @returns {any} - Temizlenmiş veri
     */
    static sanitize(data) {
        if (typeof data !== 'object' || data === null) {
            return typeof data === 'string' ? xss(data) : data;
        }
        
        const sanitized = Array.isArray(data) ? [] : {};
        
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                sanitized[key] = xss(value);
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = this.sanitize(value);
            } else {
                sanitized[key] = value;
            }
        }
        
        return sanitized;
    }

    /**
     * Email doğrulama
     * @param {string} email - Email adresi
     * @returns {boolean} - Geçerli ise true
     */
    static isValidEmail(email) {
        if (!email) return false;
        return isEmail(email);
    }

    /**
     * Boş veya null kontrolü
     * @param {any} value - Kontrol edilecek değer
     * @returns {boolean} - Boş ise true
     */
    static isEmpty(value) {
        return (
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.trim() === '') ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && Object.keys(value).length === 0)
        );
    }

    /**
     * Şifre gücünü kontrol eder (en az 8 karakter, en az bir büyük harf, bir küçük harf ve bir rakam)
     * @param {string} password - Şifre
     * @returns {boolean} - Güçlü şifre ise true
     */
    static isStrongPassword(password) {
        if (!password || typeof password !== 'string') return false;
        // Minimum 8 karakter, en az bir büyük harf, bir küçük harf ve bir rakam
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    }

    /**
     * URL doğrulama
     * @param {string} url - URL
     * @returns {boolean} - Geçerli URL ise true
     */
    static isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Tarih doğrulama
     * @param {string} dateStr - Tarih string'i
     * @returns {boolean} - Geçerli tarih ise true
     */
    static isValidDate(dateStr) {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date);
    }
    
    /**
     * Kullanıcı girişi doğrulama ve temizleme
     * @param {Object} data - Kullanıcı verileri
     * @returns {Object} - Doğrulama sonuçları
     */
    static validateUserInput(data) {
        try {
            const errors = {};
            const sanitizedData = this.sanitize(data);
            
            // Email validasyonu
            if (sanitizedData.email && !this.isValidEmail(sanitizedData.email)) {
                errors.email = 'Geçerli bir email adresi giriniz';
            }
            
            // Şifre validasyonu
            if (sanitizedData.password && !this.isStrongPassword(sanitizedData.password)) {
                errors.password = 'Şifre en az 8 karakter olmalı ve en az bir büyük harf, bir küçük harf ve bir rakam içermelidir';
            }
            
            // URL validasyonu
            if (sanitizedData.url && !this.isValidURL(sanitizedData.url)) {
                errors.url = 'Geçerli bir URL giriniz';
            }
            
            // Tarih validasyonu
            if (sanitizedData.date && !this.isValidDate(sanitizedData.date)) {
                errors.date = 'Geçerli bir tarih giriniz';
            }
            
            return {
                isValid: Object.keys(errors).length === 0,
                errors,
                sanitizedData
            };
        } catch (error) {
            logger.error('Doğrulama hatası:', error);
            return {
                isValid: false,
                errors: { general: 'Doğrulama işlemi sırasında bir hata oluştu' },
                sanitizedData: data
            };
        }
    }
}

module.exports = Validator;