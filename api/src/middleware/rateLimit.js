const rateLimit = require('express-rate-limit');
const { ErrorHandler } = require('./error');

const createRateLimiter = (options = {}) => {
    return rateLimit({
        windowMs: options.windowMs || 15 * 60 * 1000, // Varsayılan: 15 dakika
        max: options.max || 100, // Varsayılan: 15 dakika içinde 100 istek
        message: {
            success: false,
            message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.'
        },
        handler: (req, res, next, options) => {
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
        max: 5 // Saat başına 5 deneme
    }),

    // Post işlemleri için limit
    post: createRateLimiter({
        windowMs: 60 * 60 * 1000, // 1 saat
        max: 20 // Saat başına 20 post
    })
};

module.exports = limiter; 