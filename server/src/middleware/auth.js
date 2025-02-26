const jwt = require("jsonwebtoken");
const config = require("@config");
const logger = require("../utils/logger");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token bulunamadı",
        isTokenExpired: true
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Geçersiz token formatı",
        isTokenExpired: true
      });
    }

    try {
      const decodedToken = jwt.verify(token, config.jwt.secret);
      
      // Token süresini kontrol et
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        return res.status(401).json({
          success: false,
          message: "Token süresi dolmuş",
          isTokenExpired: true
        });
      }

      // Role bilgisini düzgün şekilde al
      req.user = {
        id: decodedToken.userId,
        email: decodedToken.email,
        role: decodedToken.role?.name || decodedToken.role,
        permissions: decodedToken.permissions || []
      };

      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Token süresi dolmuş",
          isTokenExpired: true
        });
      }
      throw jwtError;
    }

  } catch (error) {
    logger.error(`Kimlik doğrulama hatası: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: "Kimlik doğrulama hatası",
      isTokenExpired: true
    });
  }
};

const checkRole = (roles = []) => {
  // Tek bir rol gönderilirse array'e çevir
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Kullanıcı bilgisi bulunamadı",
          isTokenExpired: true
        });
      }

      const userRole = req.user.role;
      
      // Admin her zaman erişebilir veya belirtilen rollere sahip kullanıcılar erişebilir
      if (userRole === 'admin' || roles.includes(userRole)) {
        next();
      } else {
        logger.warn(`Yetkisiz erişim girişimi: ${req.user.email}, Rol: ${userRole}, İstenen: ${roles}`);
        return res.status(403).json({
          success: false,
          message: "Bu işlem için yetkiniz yok",
          isTokenExpired: false
        });
      }

    } catch (error) {
      logger.error(`Yetki kontrolü hatası: ${error.message}`);
      return res.status(403).json({
        success: false,
        message: "Yetki kontrolü hatası",
        isTokenExpired: false
      });
    }
  };
};

module.exports = {
  authenticate,
  checkRole,
};
