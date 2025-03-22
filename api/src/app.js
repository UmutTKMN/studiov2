require("module-alias/register");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const config = require("@config");
const { errorMiddleware } = require("./middleware/error");
const rateLimit = require("./middleware/rateLimit");
const logger = require("./utils/logger");
const morgan = require("morgan");
const swagger = require("./swagger");

// Routes
const UserRoutes = require("./routes/User.Routes");
const PostRoutes = require("./routes/Post.Routes");
const ProjectRoutes = require("./routes/Project.Routes");
const CategoryRoutes = require("./routes/Category.Routes");
const RoleRoutes = require("./routes/Role.Routes");
const ActivityLogRoutes = require("./routes/ActiviyLog.Routes");
const TicketRoutes = require("./routes/Ticket.Routes");
const TicketCategoryRoutes = require("./routes/TicketCategory.Routes");

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
    this.app.set("trust proxy", 1); // Güvenilir proxy arkasındaysa
  }

  middlewares() {
    // Güvenlik başlıkları
    this.app.use(helmet());
    
    // Sıkıştırma
    this.app.use(compression());
    
    // CORS
    this.app.use(
      cors({
        origin: config.cors.origin,
        methods: config.cors.methods,
        allowedHeaders: config.cors.allowedHeaders,
        credentials: true
      })
    );

    // Body Parser
    this.app.use(bodyParser.json({ limit: '10kb' }));
    this.app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

    // Geliştirme ortamında basit günlük kaydı
    if (config.app.env === "development") {
      this.app.use(morgan("dev"));
    } else {
      // Üretim ortamında ayrıntılı günlük kaydı
      this.app.use(morgan("combined", { stream: logger.stream }));
    }

    // Üretim ortamında hız sınırlama
    if (config.app.env === "production") {
      this.app.use("/api/", rateLimit.api);
      this.app.use("/api/auth", rateLimit.auth);
      this.app.use("/api/posts", rateLimit.post);
    }

    // API Belgeleri
    this.app.use("/api-docs", swagger.serve, swagger.setup);
  }

  routes() {
    // API Rotaları
    this.app.use("/api/auth", UserRoutes);
    this.app.use("/api/posts", PostRoutes);
    this.app.use("/api/projects", ProjectRoutes);
    this.app.use("/api/categories", CategoryRoutes);
    this.app.use("/api/roles", RoleRoutes);
    this.app.use("/api/activity-logs", ActivityLogRoutes);
    this.app.use("/api/tickets", TicketRoutes);
    this.app.use("/api/ticket-categories", TicketCategoryRoutes);

    // Kök Rota
    this.app.get("/", (req, res) => {
      res.json({
        message: "Kahra Studio API",
        version: "1.0.0",
        status: "active",
        documentation: "/api-docs"
      });
    });

    // 404 İşleyici
    this.app.all("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: `${req.originalUrl} rotası bulunamadı`
      });
    });
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
