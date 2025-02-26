const config = require("@config");
const logger = require("../utils/logger");

const adminMiddleware = (req, res, next) => {
  try {
    // Kullanıcı kontrolü
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Yetkilendirme hatası",
        error: "Kullanıcı bulunamadı"
      });
    }

    // Admin rolü kontrolü - req.user.role objesi veya string olabilir
    const userRole = typeof req.user.role === 'object' ? req.user.role.name : req.user.role;
    
    if (!userRole || userRole.toLowerCase() !== 'admin') {
      logger.warn(`Admin paneline yetkisiz erişim girişimi: ${req.user.email}`);
      return res.status(403).json({
        success: false,
        message: "Erişim reddedildi",
        error: "Bu işlem için admin yetkisi gerekli"
      });
    }

    next();
  } catch (error) {
    logger.error(`Admin middleware hatası: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası",
      error: "Yetkilendirme işlemi sırasında bir hata oluştu"
    });
  }
};

module.exports = adminMiddleware;
