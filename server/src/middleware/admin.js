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

    // Admin rolü kontrolü
    if (!req.user.role || req.user.role.name.toLowerCase() !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Erişim reddedildi",
        error: "Bu işlem için admin yetkisi gerekli"
      });
    }

    // Admin rolü ID kontrolü (opsiyonel ekstra güvenlik)
    if (req.user.role.id !== config.roles.admin) {
      return res.status(403).json({
        success: false,
        message: "Erişim reddedildi",
        error: "Geçersiz admin rolü"
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message
    });
  }
};

module.exports = adminMiddleware;
