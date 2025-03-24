require("module-alias/register");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const config = require("@config");
const { errorMiddleware } = require("./middleware/error");
const logger = require("./utils/logger");
const morgan = require("morgan");
const swagger = require("./swagger");
// tRPC eklentileri
const { createExpressMiddleware } = require("@trpc/server/adapters/express");
const { appRouter, createTRPCContext } = require("./api");

class App {
  constructor() {
    this.app = express();
    this.config();
    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  config() {
    this.app.set("port", config.app.port);
    this.app.set("trust proxy", 1);
  }

  middlewares() {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(
      cors({
        origin: "*",
        //origin: config.cors.origin,
        methods: config.cors.methods,
        allowedHeaders: config.cors.allowedHeaders,
        credentials: true,
      })
    );

    // Body Parser
    this.app.use(bodyParser.json({ limit: "10kb" }));
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "10kb" }));

    // Geliştirme ortamında basit günlük kaydı
    if (config.app.env === "development") {
      this.app.use(morgan("dev"));
    } else {
      // Üretim ortamında ayrıntılı günlük kaydı
      this.app.use(morgan("combined", { stream: logger.stream }));
    }
    // API Belgeleri
    this.app.use("/api-docs", swagger.serve, swagger.setup);
  }

  routes() {
    this.app.use(
      "/api/v1",
      createExpressMiddleware({
        router: appRouter,
        createContext: createTRPCContext,
        onError: ({ error, type, path, input, ctx, req }) => {
          console.error(`tRPC error (${type}): ${path}`, error);
        },
      })
    );
  }

  errorHandling() {
    // Hata işleme middleware
    this.app.use(errorMiddleware);
  }

  getApp() {
    return this.app;
  }
}

module.exports = new App().getApp();
