const Joi = require('joi');

const categorySchemas = {
  create: Joi.object({
    name: Joi.string()
      .required()
      .min(3)
      .max(100)
      .messages({
        'string.empty': 'Kategori adı boş olamaz',
        'string.min': 'Kategori adı en az 3 karakter olmalıdır',
        'string.max': 'Kategori adı en fazla 100 karakter olabilir',
        'any.required': 'Kategori adı zorunludur'
      }),

    description: Joi.string()
      .required()
      .min(10)
      .max(500)
      .messages({
        'string.empty': 'Kategori açıklaması boş olamaz',
        'string.min': 'Kategori açıklaması en az 10 karakter olmalıdır',
        'string.max': 'Kategori açıklaması en fazla 500 karakter olabilir',
        'any.required': 'Kategori açıklaması zorunludur'
      }),

    is_active: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'Aktiflik durumu boolean olmalıdır'
      })
  }),

  update: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .messages({
        'string.min': 'Kategori adı en az 3 karakter olmalıdır',
        'string.max': 'Kategori adı en fazla 100 karakter olabilir'
      }),

    description: Joi.string()
      .min(10)
      .max(500)
      .messages({
        'string.min': 'Kategori açıklaması en az 10 karakter olmalıdır',
        'string.max': 'Kategori açıklaması en fazla 500 karakter olabilir'
      }),

    is_active: Joi.boolean()
      .messages({
        'boolean.base': 'Aktiflik durumu boolean olmalıdır'
      })
  }).min(1).messages({
    'object.min': 'En az bir alan güncellenmelidir'
  })
};

module.exports = categorySchemas;