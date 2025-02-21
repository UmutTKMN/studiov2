const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("@config");
const logger = require("./utils/logger");

class Socket {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: config.cors.origin,
        methods: ["GET", "POST"],
      },
    });

    this.users = new Map();
    this.initialize();
  }

  initialize() {
    this.io.use(this.authenticate);
    this.io.on("connection", this.handleConnection.bind(this));
  }

  authenticate(socket, next) {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  }

  handleConnection(socket) {
    logger.info(`User connected: ${socket.user.id}`);
    this.users.set(socket.user.id, socket.id);

    // Kullanıcı bağlantısı kesildiğinde
    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.user.id}`);
      this.users.delete(socket.user.id);
    });

    // Yeni post bildirimi
    socket.on("new_post", (data) => {
      this.io.emit("post_notification", {
        type: "new_post",
        userId: socket.user.id,
        postId: data.postId,
      });
    });

    // Yeni yorum bildirimi
    socket.on("new_comment", (data) => {
      const authorSocketId = this.users.get(data.authorId);
      if (authorSocketId) {
        this.io.to(authorSocketId).emit("comment_notification", {
          type: "new_comment",
          userId: socket.user.id,
          postId: data.postId,
        });
      }
    });

    // Beğeni bildirimi
    socket.on("new_like", (data) => {
      const authorSocketId = this.users.get(data.authorId);
      if (authorSocketId) {
        this.io.to(authorSocketId).emit("like_notification", {
          type: "new_like",
          userId: socket.user.id,
          postId: data.postId,
        });
      }
    });
  }

  // Bildirim gönderme metodu
  sendNotification(userId, notification) {
    const socketId = this.users.get(userId);
    if (socketId) {
      this.io.to(socketId).emit("notification", notification);
    }
  }
}

module.exports = Socket;
