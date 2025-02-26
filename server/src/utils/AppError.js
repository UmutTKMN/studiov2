/**
 * Özel hata sınıfı
 * Operasyonel hataları işlemek için kullanılır
 */
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational;
        this.timestamp = new Date();

        // Hata stack trace'ini korumak için
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;