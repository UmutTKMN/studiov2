const Joi = require("joi");

const projectSchemas = {
  create: Joi.object({
    project_title: Joi.string()
      .min(5)
      .max(255)
      .required()
      .messages({
        'string.min': 'Başlık en az 5 karakter olmalıdır',
        'string.max': 'Başlık en fazla 255 karakter olmalıdır',
        'any.required': 'Başlık zorunludur'
      }),
    project_description: Joi.string()
      .required()
      .messages({
        'any.required': 'Proje açıklaması zorunludur'
      }),
    project_tags: Joi.string()
      .max(255)
      .allow('', null)
      .messages({
        'string.max': 'Etiketler en fazla 255 karakter olabilir'
      }),
    project_status: Joi.string()
      .valid('pending', 'in_progress', 'completed', 'archived')
      .default('pending')
      .messages({
        'any.only': 'Geçersiz proje durumu'
      }),
    project_start_date: Joi.date()
      .allow(null)
      .messages({
        'date.base': 'Geçerli bir başlangıç tarihi giriniz'
      }),
    project_end_date: Joi.date()
      .min(Joi.ref('project_start_date'))
      .allow(null)
      .messages({
        'date.base': 'Geçerli bir bitiş tarihi giriniz',
        'date.min': 'Bitiş tarihi başlangıç tarihinden önce olamaz'
      }),
    project_budget: Joi.number()
      .precision(2)
      .positive()
      .allow(null)
      .messages({
        'number.base': 'Geçerli bir bütçe giriniz',
        'number.positive': 'Bütçe pozitif bir değer olmalıdır'
      }),
    project_image: Joi.string()
      .max(255)
      .allow('', null)
      .messages({
        'string.max': 'Resim URL en fazla 255 karakter olabilir'
      })
  }),

  update: Joi.object({
    project_title: Joi.string()
      .min(5)
      .max(255)
      .messages({
        'string.min': 'Başlık en az 5 karakter olmalıdır',
        'string.max': 'Başlık en fazla 255 karakter olmalıdır'
      }),
    project_description: Joi.string()
      .messages({
        'any.required': 'Proje açıklaması zorunludur'
      }),
    project_tags: Joi.string()
      .max(255)
      .allow('', null)
      .messages({
        'string.max': 'Etiketler en fazla 255 karakter olabilir'
      }),
    project_status: Joi.string()
      .valid('pending', 'in_progress', 'completed', 'archived')
      .default('pending')
      .messages({
        'any.only': 'Geçersiz proje durumu'
      }),
    project_start_date: Joi.date()
      .allow(null)
      .messages({
        'date.base': 'Geçerli bir başlangıç tarihi giriniz'
      }),
    project_end_date: Joi.date()
      .min(Joi.ref('project_start_date'))
      .allow(null)
      .messages({
        'date.base': 'Geçerli bir bitiş tarihi giriniz',
        'date.min': 'Bitiş tarihi başlangıç tarihinden önce olamaz'
      }),
    project_budget: Joi.number()
      .precision(2)
      .positive()
      .allow(null)
      .messages({
        'number.base': 'Geçerli bir bütçe giriniz',
        'number.positive': 'Bütçe pozitif bir değer olmalıdır'
      }),
    project_image: Joi.string()
      .max(255)
      .allow('', null)
      .messages({
        'string.max': 'Resim URL en fazla 255 karakter olabilir'
      })
  }),

  search: Joi.object({
    q: Joi.string().min(2).required().messages({
      "string.min": "Arama terimi en az 2 karakter olmalıdır",
      "any.required": "Arama terimi zorunludur",
    }),
  }),

  filter: Joi.object({
    user_id: Joi.number().integer(),
    status: Joi.string().valid("active", "completed", "archived"),
    sort: Joi.string().valid("latest", "oldest", "popular"),
    limit: Joi.number().integer().min(1).max(50),
    page: Joi.number().integer().min(1),
  }),
};

module.exports = projectSchemas;
