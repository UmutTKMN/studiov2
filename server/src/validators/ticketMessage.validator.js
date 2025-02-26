const Joi = require('joi');

const messageSchemas = {
  create: Joi.object({
    message: Joi.string()
      .required()
      .min(1)
      .max(1000)
      .messages({
        'string.empty': 'Mesaj alanı boş olamaz',
        'string.min': 'Mesaj en az 1 karakter olmalıdır',
        'string.max': 'Mesaj en fazla 1000 karakter olabilir',
        'any.required': 'Mesaj alanı zorunludur'
      }),
    
    attachments: Joi.array()
      .items(Joi.string().uri())
      .max(5)
      .optional()
      .messages({
        'array.max': 'En fazla 5 dosya eklenebilir',
        'string.uri': 'Geçersiz dosya bağlantısı'
      })
  }),

  markAsRead: Joi.object({
    messageId: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Geçersiz mesaj ID',
        'number.positive': 'Geçersiz mesaj ID',
        'any.required': 'Mesaj ID zorunludur'
      })
  })
};

module.exports = messageSchemas;