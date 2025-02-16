require("module-alias/register");
const app = require("./app");
const config = require("@config");

// Uncaught exception handler
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Server
const server = app.listen(config.app.port, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${config.app.port}`);
  console.log(`📝 Environment: ${config.app.env}`);
  console.log("=================================");
});

// Unhandled rejection handler
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// SIGTERM handler
process.on("SIGTERM", () => {
  console.info("👋 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("💥 Process terminated!");
    process.exit(0);
  });
});

module.exports = server;
