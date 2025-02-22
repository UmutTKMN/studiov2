const User = require("../models/User.Model");
const ActivityLogService = require("./ActivityLog.Service"); // ActivityLogService'i ekle
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const fs = require("fs").promises;
const path = require("path");
const mysql = require("mysql");

const pool = mysql.createPool({
  ...config.db,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

class UserService {
  static async createUser(userData) {
    try {
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(userData.user_password, 10);
      userData.user_password = hashedPassword;

      // Kullanıcıyı oluştur
      const result = await User.create(userData);

      // Kayıt aktivitesini logla
      await ActivityLogService.logActivity(
        result.insertId, // Yeni oluşturulan kullanıcının ID'si
        "REGISTER",
        "users",
        result.insertId,
        `Yeni kullanıcı kaydı: ${userData.user_name} (${userData.user_email})`
      );

      // Hassas bilgileri çıkar
      const { user_password, ...userWithoutPassword } = userData;

      return {
        user_id: result.insertId,
        ...userWithoutPassword,
      };
    } catch (error) {
      throw new Error("Kullanıcı oluşturma hatası: " + error.message);
    }
  }

  static async authenticateUser(email, password) {
    try {
      const user = await User.findByEmail(email);
      let failedLoginLog = false;

      if (!user) {
        throw new Error("Kullanıcı bulunamadı");
      }

      // Kullanıcı aktif değilse
      if (!user.user_isActive) {
        throw new Error("Hesabınız devre dışı bırakılmış");
      }

      // Başarısız giriş denemelerini kontrol et
      if (user.user_failed_login_attempts >= 5) {
        const lastFailedLogin = new Date(user.user_last_failed_login);
        const lockoutDuration = 30 * 60 * 1000; // 30 dakika

        if (new Date() - lastFailedLogin < lockoutDuration) {
          throw new Error(
            "Çok fazla başarısız deneme. Lütfen 30 dakika sonra tekrar deneyin"
          );
        }
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.user_password
      );
      if (!isValidPassword) {
        // Başarısız giriş logla
        await ActivityLogService.logActivity(
          user.user_id,
          "LOGIN_FAILED",
          "users",
          user.user_id,
          `Başarısız giriş denemesi: ${email}`
        );

        failedLoginLog = true;
        await User.updateFailedLogin(user.user_id);
        throw new Error("Geçersiz şifre");
      }

      // Token oluştur
      const token = jwt.sign(
        {
          userId: user.user_id,
          email: user.user_email,
          role: {
            id: user.user_role,
            name: user.role_name,
          },
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // Başarılı giriş logla
      if (!failedLoginLog) {
        await ActivityLogService.logActivity(
          user.user_id,
          "LOGIN",
          "users",
          user.user_id,
          `Kullanıcı giriş yaptı: ${user.user_name}`
        );
      }

      // Başarılı giriş
      await User.updateLastLogin(user.user_id);

      // Hassas bilgileri çıkar
      const { user_password, ...userWithoutPassword } = user;

      return {
        token,
        user: {
          ...userWithoutPassword,
          last_login: new Date(),
        },
      };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Kimlik doğrulama hatası: " + error.message);
    }
  }

  static async getAllUsers(params = {}) {
    try {
      let query = `
        SELECT 
          u.*,
          r.role_name,
          r.role_id
        FROM users u
        LEFT JOIN roles r ON u.user_role = r.role_id
        WHERE u.user_isActive = 1
      `;

      const queryParams = [];

      // Arama filtresi
      if (params.search) {
        query += ` AND (u.user_name LIKE ? OR u.user_email LIKE ? OR u.user_bio LIKE ?)`;
        const searchTerm = `%${params.search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }

      // Rol filtresi
      if (params.role) {
        query += ` AND u.user_role = ?`;
        queryParams.push(params.role);
      }

      // Konum filtreleri
      if (params.country) {
        query += ` AND u.user_country = ?`;
        queryParams.push(params.country);
      }
      if (params.city) {
        query += ` AND u.user_city = ?`;
        queryParams.push(params.city);
      }

      // Toplam kayıt sayısını al
      const countQuery = query.replace(/SELECT .*? FROM/, 'SELECT COUNT(*) as total FROM');
      
      // Sıralama
      const validColumns = ['user_name', 'user_email', 'user_createdAt', 'user_last_login'];
      const sortBy = validColumns.includes(params.sortBy) ? params.sortBy : 'user_createdAt';
      const sortOrder = params.sortOrder === 'ASC' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${sortBy} ${sortOrder}`;

      // Sayfalama
      const page = parseInt(params.page) || 1;
      const limit = parseInt(params.limit) || 20;
      const offset = (page - 1) * limit;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(limit, offset);

      return new Promise((resolve, reject) => {
        pool.query(countQuery, queryParams.slice(0, -2), (error, countResults) => {
          if (error) {
            return reject(error);
          }

          const total = countResults[0].total;

          pool.query(query, queryParams, (error, results) => {
            if (error) {
              return reject(error);
            }

            const users = results.map(user => {
              const { user_password, reset_token, ...safeUser } = user;
              return safeUser;
            });

            resolve({
              users,
              pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
              }
            });
          });
        });
      });
    } catch (error) {
      throw new Error("Kullanıcılar getirilemedi: " + error.message);
    }
  }

  static async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Kullanıcı bulunamadı");
      }
      return user;
    } catch (error) {
      throw new Error("Kullanıcı getirme hatası: " + error.message);
    }
  }

  static async updateUser(userId, updateData) {
    try {
      // Şifre güncellenmesi varsa hashle
      if (updateData.user_password) {
        updateData.user_password = await bcrypt.hash(
          updateData.user_password,
          10
        );
      }

      const result = await User.update(userId, updateData);
      if (result.affectedRows === 0) {
        throw new Error("Kullanıcı bulunamadı");
      }

      // Profil güncelleme logunu ekle
      await ActivityLogService.logActivity(
        userId,
        "UPDATE",
        "users",
        userId,
        `Profil güncellendi: ${updateData.user_name || "name-unchanged"}`
      );

      // Güncellenmiş kullanıcıyı getir
      const updatedUser = await User.findById(userId);

      // Hassas bilgileri çıkar
      const { user_password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw new Error("Kullanıcı güncelleme hatası: " + error.message);
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Kullanıcı bulunamadı");
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.user_password
      );
      if (!isValidPassword) {
        throw new Error("Mevcut şifre yanlış");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update(user.user_id, { user_password: hashedPassword });
    } catch (error) {
      throw new Error("Şifre değiştirme hatası: " + error.message);
    }
  }

  static async forgotPassword(email) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error("Bu email adresi ile kayıtlı kullanıcı bulunamadı");
      }

      // Şifre sıfırlama token'ı oluştur
      const resetToken = jwt.sign(
        { userId: user.user_id },
        config.jwt.resetSecret,
        { expiresIn: "1h" }
      );

      // Token'ı kaydet
      await User.update(user.user_id, { reset_token: resetToken });

      // Email gönderme işlemi burada yapılacak
      return resetToken;
    } catch (error) {
      throw new Error("Şifre sıfırlama hatası: " + error.message);
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      // Token'ı doğrula
      const decoded = jwt.verify(token, config.jwt.resetSecret);

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error("Geçersiz veya süresi dolmuş token");
      }

      // Yeni şifreyi hashle ve güncelle
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update(user.user_id, {
        user_password: hashedPassword,
        reset_token: null,
      });
    } catch (error) {
      throw new Error("Şifre sıfırlama hatası: " + error.message);
    }
  }

  static async getUserStats(userId) {
    try {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            return reject(new Error("Veritabanı bağlantısı kurulamadı"));
          }

          const queries = {
            posts: "SELECT COUNT(*) as count FROM posts WHERE post_author = ?",
            projects:
              "SELECT COUNT(*) as count FROM projects WHERE project_owner = ?",
          };

          let stats = {
            posts: 0,
            projects: 0,
          };

          // İstatistikleri güvenli bir şekilde al
          connection.query(queries.posts, [userId], (error, postResults) => {
            if (error) {
              connection.release();
              return reject(error);
            }

            stats.posts = postResults[0]?.count || 0;

            connection.query(
              queries.projects,
              [userId],
              (error, projectResults) => {
                connection.release();

                if (error) {
                  return reject(error);
                }

                stats.projects = projectResults[0]?.count || 0;
                resolve(stats);
              }
            );
          });
        });
      });
    } catch (error) {
      throw new Error(`İstatistikler alınamadı: ${error.message}`);
    }
  }

  static async getPostCount(userId) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT COUNT(*) as count FROM posts WHERE post_author = ?",
        [userId],
        (error, results) => {
          if (error) reject(error);
          resolve(results[0]?.count || 0);
        }
      );
    });
  }

  static async getProjectCount(userId) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT COUNT(*) as count FROM projects WHERE project_owner = ?",
        [userId],
        (error, results) => {
          if (error) reject(error);
          resolve(results[0]?.count || 0);
        }
      );
    });
  }

  static async getFollowerCount(userId) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT COUNT(*) as count FROM followers WHERE followed_user_id = ?",
        [userId],
        (error, results) => {
          if (error) reject(error);
          resolve(results[0]?.count || 0);
        }
      );
    });
  }

  static async getFollowingCount(userId) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT COUNT(*) as count FROM followers WHERE follower_user_id = ?",
        [userId],
        (error, results) => {
          if (error) reject(error);
          resolve(results[0]?.count || 0);
        }
      );
    });
  }

  static async updateProfilePicture(userId, file) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Kullanıcı bulunamadı");
      }

      const uploadDir = path.join(__dirname, "../../uploads/profiles");
      await fs.mkdir(uploadDir, { recursive: true });

      // Eski fotoğrafı sil
      if (
        user.user_profile_picture &&
        !user.user_profile_picture.includes("default")
      ) {
        const oldPath = path.join(uploadDir, user.user_profile_picture);
        await fs.unlink(oldPath).catch(() => {});
      }

      // Yeni fotoğrafı kaydet
      const fileName = `profile_${userId}_${Date.now()}${path.extname(
        file.originalname
      )}`;
      await fs.rename(file.path, path.join(uploadDir, fileName));

      // Veritabanını güncelle
      await User.update(userId, { user_profile_picture: fileName });

      return fileName;
    } catch (error) {
      throw new Error(`Profil fotoğrafı güncellenemedi: ${error.message}`);
    }
  }

  static async updateBannerPicture(userId, file) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Kullanıcı bulunamadı");
      }

      const uploadDir = path.join(__dirname, "../../uploads/banners");
      await fs.mkdir(uploadDir, { recursive: true });

      // Eski banner'ı sil
      if (
        user.user_banner_picture &&
        !user.user_banner_picture.includes("default")
      ) {
        const oldPath = path.join(uploadDir, user.user_banner_picture);
        await fs.unlink(oldPath).catch(() => {});
      }

      // Yeni banner'ı kaydet
      const fileName = `banner_${userId}_${Date.now()}${path.extname(
        file.originalname
      )}`;
      await fs.rename(file.path, path.join(uploadDir, fileName));

      // Veritabanını güncelle
      await User.update(userId, { user_banner_picture: fileName });

      return fileName;
    } catch (error) {
      throw new Error(`Banner fotoğrafı güncellenemedi: ${error.message}`);
    }
  }

  static async getUserProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("Kullanıcı bulunamadı");

      return {
        id: user.user_id,
        name: user.user_name,
        email: user.user_email,
        bio: user.user_bio,
        role: {
          id: user.user_role,
          name: user.role_name,
        },
        profileImage: user.user_profileImage,
        education: {
          university: user.user_university,
          department: user.user_department,
          graduationYear: user.user_graduationYear,
          degree: user.user_degree,
        },
        work: {
          company: user.user_company,
          position: user.user_position,
          yearsOfExperience: user.user_yearsOfExperience,
          currentlyWorking: user.user_currentlyWorking,
        },
        social: {
          instagram: user.user_instagram,
          twitter: user.user_twitter,
          linkedin: user.user_linkedin,
          github: user.user_github,
        },
        location: {
          country: user.user_country,
          city: user.user_city,
          postalCode: user.user_postalCode,
        },
        preferences: {
          theme: user.user_theme,
          language: user.user_language,
          emailNotifications: user.user_emailNotifications,
          pushNotifications: user.user_pushNotifications,
        },
        stats: {
          lastLogin: user.user_last_login,
          loginCount: user.user_login_count,
          createdAt: user.user_createdAt,
          isVerified: user.user_isVerified,
        },
      };
    } catch (error) {
      throw new Error("Profil bilgileri alınamadı: " + error.message);
    }
  }
}

// Uygulama kapanırken pool'u temizle
process.on("SIGINT", () => {
  pool.end((err) => {
    if (err) console.error("Pool kapatma hatası:", err);
    process.exit(0);
  });
});

module.exports = UserService;
