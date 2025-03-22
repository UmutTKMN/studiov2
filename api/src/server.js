require("module-alias/register");
const app = require("./app");
const config = require("@config");
const logger = require("./utils/logger");
const Socket = require("./socket");

// İşlenmeyen istisnalar için hata yakalayıcı
process.on("uncaughtException", (err) => {
  logger.error(`İŞLENMEYEN İSTİSNA! Sunucu kapatılıyor...`);
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

const showServerInfo = () => {
  logger.info("=================================");
  logger.info(`🛠️  "${config.app.env}" modu aktif`);
  logger.info(`🚀 Kahra Studio API v1.0.0`);
  logger.info(`⏰ Başlangıç: ${new Date().toLocaleString("tr-TR")}`);
  logger.info(`Sunucu ${config.app.port} portunda başlatıldı. Çalışıyor...`);
  logger.info("=================================");
};

// Sunucu başlatma
const server = app.listen(config.app.port, () => {
  showServerInfo();
});

// Socket.io entegrasyonu
const socketServer = new Socket(server);
logger.info(`WebSocket sunucusu başlatıldı`);

// İşlenmeyen reddetmeler için hata yakalayıcı
process.on("unhandledRejection", (err) => {
  logger.error(`İŞLENMEYEN REDDETME! Sunucu kapatılıyor...`);
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// SIGTERM işleyici
process.on("SIGTERM", () => {
  logger.info("👋 SIGTERM alındı. Düzgün bir şekilde kapatılıyor...");
  server.close(() => {
    logger.info("💥 İşlem sonlandırıldı!");
    process.exit(0);
  });
});

// SIGINT işleyici (Ctrl+C)
process.on("SIGINT", () => {
  logger.info("👋 SIGINT alındı. Düzgün bir şekilde kapatılıyor...");
  server.close(() => {
    logger.info("💥 İşlem sonlandırıldı!");
    process.exit(0);
  });
});

module.exports = { server, socketServer };
