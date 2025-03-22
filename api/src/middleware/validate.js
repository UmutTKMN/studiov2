const { ErrorHandler } = require('./error');
const logger = require('../utils/logger');
const xss = require('xss');

// XSS temizleme fonksiyonu
const sanitizeData = (data) => {
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    
    const sanitized = Array.isArray(data) ? [] : {};
    
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            sanitized[key] = xss(value);
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeData(value);
        } else {
            sanitized[key] = value;
        }
    }
    
    return sanitized;
};

const validate = (schema, options = {}) => {
    return (req, res, next) => {
        try {
            // Validasyon kaynağı (body, query, params)
            const source = options.source || 'body';
            const data = req[source];
            
            // XSS koruması
            if (options.sanitize !== false) {
                req[source] = sanitizeData(data);
            }
            
            const { error, value } = schema.validate(req[source], {
                abortEarly: false,
                stripUnknown: options.stripUnknown !== false
            });
            
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Doğrulama hatası',
                    errors: error.details.map(detail => ({
                        message: detail.message,
                        path: detail.path
                    }))
                });
            }
            
            // Temiz değerleri ayarla
            req[source] = value;
            next();
        } catch (err) {
            logger.error(`Doğrulama hatası: ${err.message}`);
            res.status(500).json({
                success: false,
                message: 'Doğrulama işlemi sırasında bir hata oluştu',
            });
        }
    };
};

module.exports = validate;