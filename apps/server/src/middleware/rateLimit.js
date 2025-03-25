const rateLimit = require('express-rate-limit');
const { ErrorHandler } = require('./error');
const logger = require('../utils/logger');

const createRateLimiter = (options = {}) => {
    return rateLimit({
        windowMs: options.windowMs || 15 * 60 * 1000, // Varsayılan: 15 dakika
        max: options.max || 100, // Varsayılan: 15 dakika içinde 100 istek
        standardHeaders: true, // Rate limit bilgilerini HTTP başlıklarında gönder
        legacyHeaders: false, // X-RateLimit başlıkları kullanma
        message: {
            success: false,
            message: options.message || 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.'
        },
        handler: (req, res, next, options) => {
            const ip = req.ip;
            logger.warn(`Rate limit aşıldı: ${ip}, Path: ${req.path}`);
            next(new ErrorHandler(options.message.message, 429));
        }
    });
};

// Farklı rate limit konfigürasyonları
const limiter = {
    // Genel API limiti
    api: createRateLimiter(),

    // Auth işlemleri için daha sıkı limit
    auth: createRateLimiter({
        windowMs: 60 * 60 * 1000, // 1 saat
        max: 5, // Saat başına 5 deneme
        message: 'Çok fazla giriş denemesi. Lütfen 1 saat sonra tekrar deneyin.'
    }),

    // Post işlemleri için limit
    post: createRateLimiter({
        windowMs: 60 * 60 * 1000, // 1 saat
        max: 20, // Saat başına 20 post
        message: 'Çok fazla içerik oluşturdunuz. Lütfen daha sonra tekrar deneyin.'
    }),
    
    // API anahtarları için limit
    apiKey: createRateLimiter({
        windowMs: 60 * 1000, // 1 dakika
        max: 60, // Dakikada 60 istek (1 istek/saniye)
        message: 'API istek limiti aşıldı. Lütfen daha sonra tekrar deneyin.'
    })
};

module.exports = limiter;