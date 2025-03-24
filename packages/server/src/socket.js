const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("@config");
const logger = require("./utils/logger");
const { applyWSSHandler } = require("@trpc/server/adapters/ws");
const { WebSocketServer } = require("ws"); // Bu satır eksikti
const { appRouter } = require("./api");

class Socket {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: config.cors.origin,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.users = new Map();

    // tRPC WSS handler ekleme
    const wss = new WebSocketServer({
      server: server,
      path: "/trpc-socket",
    });

    applyWSSHandler({
      wss,
      router: appRouter,
      createContext: (opts) => {
        // WebSocket context için JWT token'ı URL parametrelerinden alabilirsiniz
        const { client } = opts;
        const token = new URL(client.url, "http://localhost").searchParams.get(
          "token"
        );

        try {
          if (!token) return { user: null };

          const user = jwt.verify(token, config.jwt.secret);
          return { user };
        } catch (error) {
          return { user: null };
        }
      },
    });

    this.initialize();
  }

  initialize() {
    this.io.use(this.authenticate);
    this.io.on("connection", this.handleConnection.bind(this));
    logger.info("Socket.io sunucusu başlatıldı");
  }

  authenticate(socket, next) {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Kimlik doğrulama hatası: Token bulunamadı"));
      }

      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded;
      next();
    } catch (err) {
      logger.error(`Socket kimlik doğrulama hatası: ${err.message}`);
      next(new Error("Kimlik doğrulama hatası"));
    }
  }

  handleConnection(socket) {
    const userId = socket.user.id;
    logger.info(`Kullanıcı bağlandı: ${userId}`);
    this.users.set(userId, socket.id);

    // Bağlantı olaylarını dinle
    this._registerDisconnectHandler(socket, userId);
    this._registerNotificationHandlers(socket);
  }

  _registerDisconnectHandler(socket, userId) {
    socket.on("disconnect", () => {
      logger.info(`Kullanıcı bağlantısı kesildi: ${userId}`);
      this.users.delete(userId);
    });
  }

  _registerNotificationHandlers(socket) {
    // Yeni gönderi bildirimi
    socket.on("new_post", (data) => {
      this.io.emit("post_notification", {
        type: "new_post",
        userId: socket.user.id,
        postId: data.postId,
      });
    });

    // Yeni yorum bildirimi
    socket.on("new_comment", (data) => {
      this._sendToSpecificUser(data.authorId, "comment_notification", {
        type: "new_comment",
        userId: socket.user.id,
        postId: data.postId,
      });
    });

    // Beğeni bildirimi
    socket.on("new_like", (data) => {
      this._sendToSpecificUser(data.authorId, "like_notification", {
        type: "new_like",
        userId: socket.user.id,
        postId: data.postId,
      });
    });
  }

  _sendToSpecificUser(userId, event, data) {
    const socketId = this.users.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Genel bildirim gönderme metodu
  sendNotification(userId, notification) {
    const socketId = this.users.get(userId);
    if (socketId) {
      this.io.to(socketId).emit("notification", notification);
    }
  }
}

module.exports = Socket;
