const mysql = require("mysql2/promise");
const dbConfig = require("./database");
const logger = require("../utils/logger");

let pool;

try {
  pool = mysql.createPool(dbConfig);
  
  // Bağlantı testi
  pool.getConnection()
    .then(connection => {
      logger.info('Veritabanı bağlantısı başarıyla kuruldu.');
      connection.release();
    })
    .catch(err => {
      logger.error('Veritabanı bağlantı hatası:', err.message);
    });
    
} catch (error) {
  logger.error('Veritabanı havuzu oluşturma hatası:', error.message);
  process.exit(1);
}

module.exports = pool;
