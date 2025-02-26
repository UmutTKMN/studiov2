const UserService = require("../services/User.Service");
const ActivityLogService = require("../services/ActivityLog.Service"); // ActivityLogService'i ekle
const { ErrorHandler } = require("../middleware/error");

class UserController {
  static async register(req, res, next) {
    try {
      // Kullanıcı verilerini hazırla
      const userData = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_password: req.body.user_password,
        user_bio: req.body.user_bio,
        user_role: req.body.user_role || 2, // Varsayılan kullanıcı rolü
        user_profileImage: req.body.user_profileImage,
        // Eğitim bilgileri
        user_university: req.body.user_university,
        user_department: req.body.user_department,
        user_graduationYear: req.body.user_graduationYear,
        user_degree: req.body.user_degree,
        // İş bilgileri
        user_company: req.body.user_company,
        user_position: req.body.user_position,
        user_yearsOfExperience: req.body.user_yearsOfExperience,
        user_currentlyWorking: req.body.user_currentlyWorking,
        // Sosyal medya
        user_instagram: req.body.user_instagram,
        user_twitter: req.body.user_twitter,
        user_linkedin: req.body.user_linkedin,
        user_github: req.body.user_github,
        // Adres bilgileri
        user_country: req.body.user_country,
        user_city: req.body.user_city,
        user_postalCode: req.body.user_postalCode,
        // Kullanıcı tercihleri
        user_theme: req.body.user_theme || 'light',
        user_language: req.body.user_language || 'en'
      };

      const newUser = await UserService.createUser(userData);

      res.status(201).json({
        success: true,
        message: "Kullanıcı başarıyla kaydedildi",
        user: newUser
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async login(req, res, next) {
    try {
      console.log('Login attempt with:', req.body); // Debug için

      const { user_email, user_password } = req.body;
      
      if (!user_email || !user_password) {
        throw new Error('Email ve şifre gereklidir');
      }

      const result = await UserService.authenticateUser(user_email, user_password);

      console.log('Login result:', result); // Debug için

      res.status(200).json({
        success: true,
        message: "Giriş başarılı",
        token: result.token,
        user: {
          id: result.user.user_id,
          name: result.user.user_name,
          email: result.user.user_email,
          role: result.user.role_name,
          theme: result.user.user_theme,
          language: result.user.user_language
        }
      });
    } catch (error) {
      console.error('Login error:', error); // Debug için
      next(new ErrorHandler(error.message, 401));
    }
  }

  static async getProfile(req, res, next) {
    try {
      const profile = await UserService.getUserProfile(req.user.id);

      res.status(200).json({
        success: true,
        user: {
          ...profile,
          // Hassas bilgileri çıkar
          user_password: undefined,
          user_reset_token: undefined
        }
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const updateData = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_bio: req.body.user_bio,
        user_profileImage: req.body.user_profileImage,
        // Eğitim bilgileri
        user_university: req.body.user_university,
        user_department: req.body.user_department,
        user_graduationYear: req.body.user_graduationYear,
        user_degree: req.body.user_degree,
        // İş bilgileri
        user_company: req.body.user_company,
        user_position: req.body.user_position,
        user_yearsOfExperience: req.body.user_yearsOfExperience,
        user_currentlyWorking: req.body.user_currentlyWorking,
        // Sosyal medya
        user_instagram: req.body.user_instagram,
        user_twitter: req.body.user_twitter,
        user_linkedin: req.body.user_linkedin,
        user_github: req.body.user_github,
        // Adres bilgileri
        user_country: req.body.user_country,
        user_city: req.body.user_city,
        user_postalCode: req.body.user_postalCode,
        // Kullanıcı tercihleri
        user_theme: req.body.user_theme,
        user_language: req.body.user_language
      };

      const updatedUser = await UserService.updateUser(req.user.id, updateData);

      res.status(200).json({
        success: true,
        message: "Profil güncellendi",
        user: updatedUser
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Eksik alan",
          error: "Mevcut şifre ve yeni şifre zorunludur",
        });
      }

      await UserService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      res.status(200).json({
        success: true,
        message: "Şifre başarıyla değiştirildi",
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      const filters = {
        page,
        limit,
        search: req.query.search,
        role: req.query.role,
        sortBy: req.query.sortBy || 'user_createdAt',
        sortOrder: req.query.sortOrder?.toUpperCase() || 'DESC',
        country: req.query.country,
        city: req.query.city
      };

      const result = await UserService.getAllUsers(filters);

      res.status(200).json({
        success: true,
        users: result.users.map((user) => ({
          id: user.user_id,
          name: user.user_name,
          email: user.user_email,
          bio: user.user_bio,
          role: {
            id: user.role_id,
            name: user.role_name
          },
          location: {
            country: user.user_country,
            city: user.user_city
          },
          profileImage: user.user_profileImage,
          createdAt: user.user_createdAt,
          lastLogin: user.user_last_login
        })),
        pagination: {
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages
        }
      });
    }
    catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getUserById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Kullanıcı bulunamadı",
        });
      }

      res.status(200).json({
        success: true,
        user: {
          username: user.user_username,
          name: user.user_name,
          surname: user.user_surname,
          location: user.user_location,
          bio: user.user_bio,
          profile_picture: user.user_profile_picture,
        },
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 404));
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await UserService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi",
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      await UserService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: "Şifreniz başarıyla sıfırlandı",
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async uploadProfilePicture(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Fotoğraf yüklenmedi",
        });
      }

      const fileName = await UserService.updateProfilePicture(
        req.user.id,
        req.file
      );

      res.status(200).json({
        success: true,
        message: "Profil fotoğrafı güncellendi",
        profile_picture: fileName,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async uploadBannerPicture(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Fotoğraf yüklenmedi",
        });
      }

      const fileName = await UserService.updateBannerPicture(
        req.user.id,
        req.file
      );

      res.status(200).json({
        success: true,
        message: "Kapak fotoğrafı güncellendi",
        banner_picture: fileName,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async removeProfilePicture(req, res, next) {
    try {
      await UserService.removeProfilePicture(req.user.id);
      res.status(200).json({
        success: true,
        message: "Profil fotoğrafı kaldırıldı",
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async removeBannerPicture(req, res, next) {
    try {
      await UserService.removeBannerPicture(req.user.id);
      res.status(200).json({
        success: true,
        message: "Kapak fotoğrafı kaldırıldı",
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getLoginHistory(req, res, next) {
    try {
      const history = await ActivityLogService.getUserActivity(req.user.id, 20);
      
      res.status(200).json({
        success: true,
        history: history.map(log => ({
          action: log.log_action,
          timestamp: log.log_createdAt,
          description: log.log_description
        }))
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getAdminUsers(req, res, next) {
    try {
      const adminUsers = await UserService.getAdminUsers();
      
      res.status(200).json({
        success: true,
        adminUsers
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async logout(req, res, next) {
    try {
      await ActivityLogService.logActivity(
        req.user.id,
        'LOGOUT',
        'users',
        req.user.id,
        `Kullanıcı çıkış yaptı: ${req.user.name}`
      );

      res.status(200).json({
        success: true,
        message: "Başarıyla çıkış yapıldı"
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }
}

module.exports = UserController;
