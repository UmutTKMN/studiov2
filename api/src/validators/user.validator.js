const Joi = require("joi");

const userSchemas = {
  register: Joi.object({
    user_name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'İsim en az 2 karakter olmalıdır',
      'string.max': 'İsim en fazla 100 karakter olmalıdır',
      'any.required': 'İsim zorunludur'
    }),
    user_email: Joi.string().email().max(150).required().messages({
      'string.email': 'Geçerli bir email adresi giriniz',
      'string.max': 'Email adresi en fazla 150 karakter olmalıdır',
      'any.required': 'Email adresi zorunludur'
    }),
    user_password: Joi.string().min(6).required().messages({
      'string.min': 'Şifre en az 6 karakter olmalıdır',
      'any.required': 'Şifre zorunludur'
    }),
    // Eğitim bilgileri
    user_university: Joi.string().max(150).allow('', null),
    user_department: Joi.string().max(150).allow('', null),
    user_graduationYear: Joi.number().integer().min(1900).max(2100).allow(null),
    user_degree: Joi.string().max(50).allow('', null),

    // İş bilgileri
    user_company: Joi.string().max(150).allow('', null),
    user_position: Joi.string().max(100).allow('', null),
    user_yearsOfExperience: Joi.number().integer().min(0).allow(null),
    user_currentlyWorking: Joi.boolean().default(false),

    // Sosyal medya
    user_instagram: Joi.string().max(255).allow('', null),
    user_twitter: Joi.string().max(255).allow('', null),
    user_linkedin: Joi.string().max(255).allow('', null),
    user_github: Joi.string().max(255).allow('', null),

    // Adres bilgileri
    user_country: Joi.string().max(100).allow('', null),
    user_city: Joi.string().max(100).allow('', null),
    user_postalCode: Joi.string().max(20).allow('', null),

    // Kullanıcı tercihleri
    user_theme: Joi.string().valid('light', 'dark').default('light'),
    user_language: Joi.string().max(10).default('en'),
    user_emailNotifications: Joi.boolean().default(true),
    user_pushNotifications: Joi.boolean().default(true)
  }),

  login: Joi.object({
    user_email: Joi.string().email().required().messages({
      "string.email": "Geçerli bir email adresi giriniz",
      "any.required": "Email adresi zorunludur",
    }),
    user_password: Joi.string().required().messages({
      "any.required": "Şifre zorunludur",
    }),
  }),

  updateProfile: Joi.object({
    user_name: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .messages({
        "string.min": "İsim en az 2 karakter olmalıdır",
        "string.max": "İsim en fazla 100 karakter olmalıdır",
      }),
    user_email: Joi.string().email().max(150).optional().messages({
      "string.email": "Geçerli bir email adresi giriniz",
      "string.max": "Email adresi en fazla 150 karakter olmalıdır",
    }),
    user_bio: Joi.string().max(500).optional().allow("").messages({
      "string.max": "Biyografi en fazla 500 karakter olmalıdır",
    }),
    // Eğitim bilgileri
    user_university: Joi.string().max(150).optional().allow("").messages({
      "string.max": "Üniversite adı en fazla 150 karakter olmalıdır",
    }),
    user_department: Joi.string().max(150).optional().allow("").messages({
      "string.max": "Bölüm adı en fazla 150 karakter olmalıdır",
    }),
    user_graduationYear: Joi.number()
      .integer()
      .min(1900)
      .max(2100)
      .optional()
      .allow(null)
      .messages({
        "number.base": "Geçerli bir mezuniyet yılı giriniz",
        "number.min": "Mezuniyet yılı 1900'den küçük olamaz",
        "number.max": "Mezuniyet yılı 2100'den büyük olamaz",
      }),
    user_degree: Joi.string().max(50).optional().allow("").messages({
      "string.max": "Derece en fazla 50 karakter olmalıdır",
    }),
    // İş bilgileri
    user_company: Joi.string().max(150).optional().allow("").messages({
      "string.max": "Şirket adı en fazla 150 karakter olmalıdır",
    }),
    user_position: Joi.string().max(100).optional().allow("").messages({
      "string.max": "Pozisyon en fazla 100 karakter olmalıdır",
    }),
    user_yearsOfExperience: Joi.number()
      .integer()
      .min(0)
      .optional()
      .allow(null)
      .messages({
        "number.base": "Geçerli bir deneyim yılı giriniz",
        "number.min": "Deneyim yılı 0'dan küçük olamaz",
      }),
    user_currentlyWorking: Joi.boolean().optional(),
    // Sosyal medya bilgileri
    user_instagram: Joi.string().max(255).optional().allow("").messages({
      "string.max": "Instagram bağlantısı en fazla 255 karakter olmalıdır",
    }),
    user_twitter: Joi.string().max(255).optional().allow("").messages({
      "string.max": "Twitter bağlantısı en fazla 255 karakter olmalıdır",
    }),
    user_linkedin: Joi.string().max(255).optional().allow("").messages({
      "string.max": "LinkedIn bağlantısı en fazla 255 karakter olmalıdır",
    }),
    user_github: Joi.string().max(255).optional().allow("").messages({
      "string.max": "GitHub bağlantısı en fazla 255 karakter olmalıdır",
    }),
    // Adres bilgileri
    user_country: Joi.string().max(100).optional().allow("").messages({
      "string.max": "Ülke adı en fazla 100 karakter olmalıdır",
    }),
    user_city: Joi.string().max(100).optional().allow("").messages({
      "string.max": "Şehir adı en fazla 100 karakter olmalıdır",
    }),
    user_postalCode: Joi.string().max(20).optional().allow("").messages({
      "string.max": "Posta kodu en fazla 20 karakter olmalıdır",
    }),
    // Kullanıcı tercihleri
    user_theme: Joi.string().valid("light", "dark").optional().messages({
      "any.only": "Tema sadece light veya dark olabilir",
    }),
    user_language: Joi.string().max(10).optional().messages({
      "string.max": "Dil kodu en fazla 10 karakter olmalıdır",
    }),
    user_emailNotifications: Joi.boolean().optional(),
    user_pushNotifications: Joi.boolean().optional(),
    // Profil ve banner resimleri
    user_profileImage: Joi.string().optional().allow(""),
  }),

  resetPassword: Joi.object({
    user_email: Joi.string().email().required().messages({
      "string.email": "Geçerli bir email adresi giriniz",
      "any.required": "Email adresi zorunludur",
    }),
    user_password: Joi.string()
      .min(6)
      .max(100)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/)
      .required()
      .messages({
        "string.min": "Şifre en az 6 karakter olmalıdır",
        "string.max": "Şifre en fazla 100 karakter olmalıdır",
        "string.pattern.base":
          "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir",
        "any.required": "Yeni şifre zorunludur",
      }),
    resetToken: Joi.string().required().messages({
      "any.required": "Sıfırlama kodu zorunludur",
    }),
  }),
};

module.exports = userSchemas;
