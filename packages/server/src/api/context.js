const jwt = require("jsonwebtoken");
const config = require("@config");
const logger = require("../utils/logger");

/**
 * tRPC istekleri için context oluşturucu
 * @param {Object} opts - Express request ve response objeleri
 * @returns {Object} Context objesi (kullanıcı bilgisi vs.)
 */
const createTRPCContext = async ({ req, res }) => {
  const ctx = { req, res, user: null };

  try {
    // Token'ı headerdan alma
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      // Token'ı doğrulama
      const decoded = jwt.verify(token, config.jwt.secret);

      // Context'e kullanıcı bilgisini ekleme
      ctx.user = decoded;
    }
  } catch (error) {
    logger.error(`Context oluşturma hatası: ${error.message}`);
  }

  return ctx;
};

module.exports = { createTRPCContext };
