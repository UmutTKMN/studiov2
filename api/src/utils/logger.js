const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");
const config = require("@config");

// Log klasörünü oluştur
const logDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Özel log format
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  const logText = `${timestamp} | ${level}: ${message}`;
  return stack ? `${logText}\n${stack}` : logText;
});

// Winston transport konfigürasyonu
const transports = [
  // Konsol çıktısı
  new winston.transports.Console({
    level: config.app.env === "development" ? "debug" : "info",
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level.toUpperCase().padEnd(5)}]: ${stack ? stack : message}`;
      })
    ),
  }),

  // Günlük dosya rotasyonu - tüm loglar
  new winston.transports.DailyRotateFile({
    filename: "logs/application-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: process.env.LOG_MAX_SIZE || "10m",
    maxFiles: process.env.LOG_MAX_FILES || "7d",
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      logFormat
    ),
  }),

  // Sadece hata logları için ayrı dosya
  new winston.transports.DailyRotateFile({
    filename: "logs/error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: process.env.LOG_MAX_SIZE || "10m",
    maxFiles: process.env.LOG_MAX_FILES || "7d",
    level: "error",
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      logFormat
    ),
  }),
];

// Logger instance'ı oluştur
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "kahra-studio-api" },
  transports,
  exitOnError: false,
});

// Morgan için stream
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Hassas verileri temizleme fonksiyonu
const sensitiveKeys = ["password", "token", "secret", "key", "apiKey", "auth"];
const sanitizeData = (data) => {
  if (!data || typeof data !== "object") return data;

  const sanitized = { ...data };
  
  for (const key in sanitized) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
      sanitized[key] = "[GİZLİ]";
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }
  
  return sanitized;
};

// Güvenli log metotları
const safeLog = (level, message, meta) => {
  if (meta) {
    return logger[level](message, sanitizeData(meta));
  }
  return logger[level](message);
};

// Güvenli loglama için wrapper
module.exports = {
  error: (message, meta) => safeLog('error', message, meta),
  warn: (message, meta) => safeLog('warn', message, meta),
  info: (message, meta) => safeLog('info', message, meta),
  debug: (message, meta) => safeLog('debug', message, meta),
  stream: logger.stream
};