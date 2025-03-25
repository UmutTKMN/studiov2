const { Pool } = require("pg");
const dbConfig = require("./database");
const logger = require("../utils/logger");

let pool;

try {
  pool = new Pool(dbConfig);

  // Bağlantı testi
  pool
    .connect()
    .then((client) => {
      logger.info("PostgreSQL veritabanı bağlantısı başarıyla kuruldu.");
      client.release();
    })
    .catch((err) => {
      logger.error("PostgreSQL veritabanı bağlantı hatası:", err.message);
    });
} catch (error) {
  logger.error("PostgreSQL veritabanı havuzu oluşturma hatası:", error.message);
  process.exit(1);
}

module.exports = pool;
