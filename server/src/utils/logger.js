const winston = require('winston');
const config = require('@config');

const logger = winston.createLogger({
    level: config.app.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'kahra-studio-api' },
    transports: [
        // Konsola log
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Dosyaya log
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log' 
        })
    ]
});

// Morgan middleware için stream
logger.stream = {
    write: (message) => logger.info(message.trim())
};

module.exports = logger; 