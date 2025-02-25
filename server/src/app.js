require("module-alias/register");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
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
const FeedbackRoutes = require("./feedback/routes/Feedback.Routes");

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
  }

  middlewares() {
    // CORS
    this.app.use(
      cors({
        origin: config.cors.origin,
        methods: config.cors.methods,
        allowedHeaders: config.cors.allowedHeaders,
      })
    );

    // Body Parser
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Request Logger
    if (config.app.env === "development") {
      this.app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
      });
    }

    // Cache middleware'ini koşullu olarak ekle
    if (config.app.env === "production") {
      // Rate limiting
      this.app.use("/api/", rateLimit.api);
      this.app.use("/api/auth", rateLimit.auth);
      this.app.use("/api/posts", rateLimit.post);
    }

    // Logging
    this.app.use(morgan("combined", { stream: logger.stream }));

    // API Documentation
    this.app.use("/api-docs", swagger.serve, swagger.setup);
  }

  routes() {
    // API Routes
    this.app.use("/api/auth", UserRoutes);
    this.app.use("/api/posts", PostRoutes);
    this.app.use("/api/projects", ProjectRoutes);
    this.app.use("/api/categories", CategoryRoutes);
    this.app.use("/api/roles", RoleRoutes);
    this.app.use("/api/activity-logs", ActivityLogRoutes);
    this.app.use("/api/feedback", FeedbackRoutes);

    // Root Route
    this.app.get("/", (req, res) => {
      res.json({
        message: "Kahra Studio API",
        version: "1.0.0",
        status: "active",
      });
    });

    // 404 Handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: "Endpoint bulunamadı",
      });
    });
  }

  errorHandling() {
    // Error middleware
    this.app.use(errorMiddleware);
  }

  getApp() {
    return this.app;
  }
}

module.exports = new App().getApp();
