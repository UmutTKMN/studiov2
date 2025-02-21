require("dotenv").config();

const config = {
  app: {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  roles: {
    defaultRole: 2, // user role_id
    availableRoles: {
      admin: 1,
      user: 2,
      moderator: 3
    }
  }
};

// Veritabanı bağlantı bilgilerini kontrol et
console.log("Database Config:", {
  host: config.db.host,
  user: config.db.user,
  database: config.db.database,
  port: config.db.port,
});

module.exports = config;
