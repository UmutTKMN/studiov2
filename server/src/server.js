require("module-alias/register");
const app = require("./app");
const config = require("@config");
const logger = require("./utils/logger");
const Socket = require("./socket");
const figlet = require("figlet");
const boxen = require("boxen");
const chalk = require("chalk");

// İşlenmeyen istisnalar için hata yakalayıcı
process.on("uncaughtException", (err) => {
  logger.error(`İŞLENMEYEN İSTİSNA! Sunucu kapatılıyor...`);
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

// Konsol başlık logosu
const renderServerBanner = () => {
  try {
    const figletText = figlet.textSync('Kahra Studio', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    });

    const versionInfo = `v1.0.0`;
    const serverInfo = `${config.app.env.toUpperCase()} SUNUCUSU`;
    const portInfo = `http://${config.app.host || 'localhost'}:${config.app.port}`;
    const dateInfo = `Başlangıç: ${new Date().toLocaleString('tr-TR')}`;

    const banner = boxen(
      `${chalk.blueBright(figletText)}\n\n` +
      `${chalk.greenBright('•')} ${chalk.bold('Kahra Studio API')} ${chalk.gray(versionInfo)}\n` +
      `${chalk.greenBright('•')} ${chalk.bold(serverInfo)}\n` +
      `${chalk.greenBright('•')} ${chalk.bold('Adres:')} ${chalk.cyan(portInfo)}\n` +
      `${chalk.greenBright('•')} ${chalk.bold('Swagger:')} ${chalk.cyan(portInfo + '/api-docs')}\n` +
      `${chalk.greenBright('•')} ${chalk.gray(dateInfo)}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'blue'
      }
    );

    console.log(banner);
  } catch (err) {
    // Banner oluşturulamazsa standart log kullan
    logger.info("=================================");
    logger.info(`🚀 Sunucu ${config.app.port} portunda çalışıyor`);
    logger.info(`📝 Ortam: ${config.app.env}`);
    logger.info("=================================");
  }
};

// Sunucu başlatma
const server = app.listen(config.app.port, () => {
  renderServerBanner();
  logger.info(`Sunucu ${config.app.port} portunda başlatıldı (${config.app.env} ortamı)`);
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
