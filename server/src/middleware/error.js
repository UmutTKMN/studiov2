const config = require('@config');
const logger = require('../utils/logger');

class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Hatayı logla
    if (err.statusCode >= 500) {
        logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        logger.error(err.stack);
    } else {
        logger.warn(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }

    // Geliştirme ortamında tam hata bilgilerini gönder
    const errorResponse = {
        success: false,
        status: err.status,
        message: err.message || 'Bir hata oluştu',
    };

    // Geliştirme ortamında ek hata detayları ekle
    if (config.app.env === 'development') {
        errorResponse.error = err;
        errorResponse.stack = err.stack;
    }

    res.status(err.statusCode).json(errorResponse);
};

module.exports = {
    ErrorHandler,
    errorMiddleware
};