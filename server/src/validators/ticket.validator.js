const Joi = require('joi');

const ticketSchemas = {
  create: Joi.object({
    title: Joi.string().required().min(5).max(255)
      .messages({
        'string.empty': 'Başlık alanı zorunludur',
        'string.min': 'Başlık en az 5 karakter olmalıdır',
        'string.max': 'Başlık en fazla 255 karakter olabilir'
      }),
    description: Joi.string().required().min(10)
      .messages({
        'string.empty': 'Açıklama alanı zorunludur',
        'string.min': 'Açıklama en az 10 karakter olmalıdır'
      }),
    category_id: Joi.number().integer().required()
      .messages({
        'number.base': 'Kategori ID bir sayı olmalıdır',
        'any.required': 'Kategori seçimi zorunludur'
      }),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent')
      .default('medium')
      .messages({
        'any.only': 'Geçersiz öncelik seviyesi'
      })
  }),

  addMessage: Joi.object({
    message: Joi.string().required().min(1)
      .messages({
        'string.empty': 'Mesaj alanı zorunludur',
        'string.min': 'Mesaj boş olamaz'
      }),
    attachments: Joi.array().items(Joi.string()).optional()
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid('open', 'in_progress', 'resolved', 'closed')
      .required()
      .messages({
        'any.only': 'Geçersiz durum',
        'string.empty': 'Durum alanı zorunludur'
      })
  })
};

module.exports = ticketSchemas;