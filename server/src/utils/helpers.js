const path = require('path');
const fs = require('fs').promises;
const logger = require('./logger');

/**
 * Çeşitli yardımcı fonksiyonlar
 */
class Helpers {
    /**
     * Tarih formatlar
     * @param {Date|string} date - Formatlanacak tarih
     * @param {string} format - Format şablonu (YYYY-MM-DD, DD.MM.YYYY, vb)
     * @returns {string} - Formatlanmış tarih
     */
    static formatDate(date, format = 'YYYY-MM-DD') {
        try {
            const dateObj = date instanceof Date ? date : new Date(date);
            if (isNaN(dateObj.getTime())) {
                throw new Error('Geçersiz tarih');
            }
            
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const seconds = String(dateObj.getSeconds()).padStart(2, '0');
            
            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds);
        } catch (error) {
            logger.error('Tarih formatlama hatası:', error);
            return '';
        }
    }
    
    /**
     * Dosya boyutunu formatlar
     * @param {number} bytes - Byte cinsinden boyut
     * @returns {string} - Formatlanmış boyut (KB, MB, GB)
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }
    
    /**
     * Belirtilen klasördeki dosyaları okur
     * @param {string} dirPath - Klasör yolu
     * @returns {Promise<Array>} - Dosya listesi
     */
    static async getFilesInDirectory(dirPath) {
        try {
            const absolutePath = path.resolve(dirPath);
            const files = await fs.readdir(absolutePath);
            
            const fileInfos = await Promise.all(files.map(async (file) => {
                const filePath = path.join(absolutePath, file);
                const stats = await fs.stat(filePath);
                
                return {
                    name: file,
                    path: filePath,
                    size: stats.size,
                    formattedSize: this.formatFileSize(stats.size),
                    createdAt: stats.birthtime,
                    modifiedAt: stats.mtime,
                    isDirectory: stats.isDirectory()
                };
            }));
            
            return fileInfos;
        } catch (error) {
            logger.error(`Klasör okuma hatası (${dirPath}):`, error);
            return [];
        }
    }
    
    /**
     * Metni kırpar ve uzunsa '...' ekler
     * @param {string} text - Kırpılacak metin
     * @param {number} maxLength - Maksimum uzunluk
     * @returns {string} - Kırpılmış metin
     */
    static truncateText(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    /**
     * URL'den dosya adını çıkarır
     * @param {string} url - URL
     * @returns {string} - Dosya adı
     */
    static getFileNameFromUrl(url) {
        if (!url) return '';
        try {
            return path.basename(new URL(url).pathname);
        } catch (error) {
            return path.basename(url);
        }
    }
    
    /**
     * Benzersiz slug oluşturur
     * @param {string} text - Slug yapılacak metin
     * @returns {string} - Slug
     */
    static createSlug(text) {
        if (!text) return '';
        
        const slug = text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-ğüşıöçĞÜŞİÖÇ]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
            // Türkçe karakterleri değiştir
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c');
            
        return `${slug}-${Date.now().toString(36)}`;
    }
    
    /**
     * Objedeki boş değerleri temizler
     * @param {Object} obj - Temizlenecek obje
     * @returns {Object} - Temizlenmiş obje
     */
    static removeEmptyValues(obj) {
        const result = {};
        
        Object.entries(obj).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                result[key] = value;
            }
        });
        
        return result;
    }
}

module.exports = Helpers;