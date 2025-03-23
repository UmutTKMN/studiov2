const User = require("../models/User.Model");
const ActivityLogService = require("./ActivityLog.Service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const pool = require("../config/pool"); // MySQL yerine PostgreSQL pool'u kullanılıyor

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
        result.user_id,
        "REGISTER",
        "users",
        result.user_id,
        `Yeni kullanıcı kaydı: ${userData.user_name} (${userData.user_email})`
      );

      const { user_password, ...userWithoutPassword } = userData;
      return {
        user_id: result.user_id,
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
      // // Kullanıcı aktif değilse
      // if (Boolean(user.user_isActive) === false) {
      //   throw new Error("Hesabınız devre dışı bırakılmış");
      // }
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

  static async logout(userId) {
    try {
      await ActivityLogService.logActivity(
        userId,
        "LOGOUT",
        "users",
        userId,
        `Kullanıcı çıkış yaptı`
      );
      return { success: true, message: "Çıkış başarılı" };
    } catch (error) {
      throw new Error("Çıkış hatası: " + error.message);
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
        WHERE u.user_isActive = true
      `;

      const queryParams = [];
      let paramIndex = 1;

      // Arama filtresi
      if (params.search) {
        query += ` AND (u.user_name LIKE $${paramIndex} OR u.user_email LIKE $${
          paramIndex + 1
        } OR u.user_bio LIKE $${paramIndex + 2})`;
        const searchTerm = `%${params.search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
        paramIndex += 3;
      }

      // Rol filtresi
      if (params.role) {
        query += ` AND u.user_role = $${paramIndex}`;
        queryParams.push(params.role);
        paramIndex++;
      }

      // Konum filtreleri
      if (params.country) {
        query += ` AND u.user_country = $${paramIndex}`;
        queryParams.push(params.country);
        paramIndex++;
      }

      if (params.city) {
        query += ` AND u.user_city = $${paramIndex}`;
        queryParams.push(params.city);
        paramIndex++;
      }

      // Toplam kayıt sayısını al
      const countQuery = query.replace(
        /SELECT .*? FROM/,
        "SELECT COUNT(*) as total FROM"
      );

      // Sıralama
      const validColumns = [
        "user_name",
        "user_email",
        "user_createdAt",
        "user_last_login",
      ];

      const sortBy = validColumns.includes(params.sortBy)
        ? params.sortBy
        : "user_createdAt";

      const sortOrder = params.sortOrder === "ASC" ? "ASC" : "DESC";
      query += ` ORDER BY ${sortBy} ${sortOrder}`;

      // Sayfalama
      const page = parseInt(params.page) || 1;
      const limit = parseInt(params.limit) || 20;
      const offset = (page - 1) * limit;

      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limit, offset);

      // Önce toplam sayıyı al
      const countResult = await pool.query(
        countQuery,
        queryParams.slice(0, -2)
      );
      const total = parseInt(countResult.rows[0].total);

      // Sorguyu çalıştır
      const result = await pool.query(query, queryParams);

      // Kullanıcıları formatla ve hassas bilgileri kaldır
      const users = result.rows.map((user) => {
        const { user_password, reset_token, ...safeUser } = user;
        return safeUser;
      });

      return {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error("Kullanıcılar getirilemedi: " + error.message);
    }
  }

  static async getUser(userId) {
    try {
      const query = `
        SELECT
          u.*,
          r.role_name
        FROM users u
        LEFT JOIN roles r ON u.user_role = r.role_id
        WHERE u.user_id = $1
      `;

      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
        throw new Error("Kullanıcı bulunamadı");
      }

      const user = result.rows[0];
      const { user_password, reset_token, ...safeUser } = user;

      return safeUser;
    } catch (error) {
      throw new Error("Kullanıcı getirilemedi: " + error.message);
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
      if (result.rowCount === 0) {
        throw new Error("Kullanıcı bulunamadı");
      }

      await ActivityLogService.logActivity(
        userId,
        "UPDATE",
        "users",
        userId,
        `Profil güncellendi: ${updateData.user_name || "name-unchanged"}`
      );

      const updatedUser = await User.findById(userId);
      const { user_password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw new Error("Kullanıcı güncelleme hatası: " + error.message);
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

  static async getAdminUsers() {
    try {
      const query = `
        SELECT u.user_id, u.user_name, u.user_email, u.user_profileImage, 
               u.user_createdAt, u.user_last_login, r.role_name
        FROM users u
        JOIN roles r ON u.user_role = r.role_id
        WHERE r.role_name = 'admin' AND u.user_isActive = true
        ORDER BY u.user_name ASC
      `;

      const result = await pool.query(query);

      const adminUsers = result.rows.map((user) => ({
        id: user.user_id,
        name: user.user_name,
        email: user.user_email,
        profileImage: user.user_profileImage,
        role: user.role_name,
        createdAt: user.user_createdAt,
        lastLogin: user.user_last_login,
      }));

      return adminUsers;
    } catch (error) {
      throw new Error("Admin kullanıcıları getirilemedi: " + error.message);
    }
  }
}

module.exports = UserService;
