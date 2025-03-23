require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432, // PostgreSQL varsayılan portu
  max: parseInt(process.env.DB_CONNECTION_LIMIT) || 10, // connectionLimit yerine max
  idleTimeoutMillis: 30000, // bağlantı boşta kalma süresi
  connectionTimeoutMillis: 60000, // bağlantı zaman aşımı
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
};

module.exports = dbConfig;
