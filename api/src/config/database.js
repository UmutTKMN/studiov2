require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  waitForConnections: true,
  queueLimit: 0,
  connectTimeout: 60000,
  dateStrings: true,
  supportBigNumbers: true,
  bigNumberStrings: true,
  multipleStatements: false, // SQL enjeksiyon güvenliği için
};

module.exports = dbConfig;
