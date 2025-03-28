require("dotenv").config();

const config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432, // PostgreSQL varsayılan portu 3306 yerine 5432
    max: 10, // connectionLimit yerine max
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 60000,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  },
  roles: {
    defaultRole: 2, // user role_id
    availableRoles: {
      admin: 1,
      user: 2,
      moderator: 3,
    },
  },
};

module.exports = config;
