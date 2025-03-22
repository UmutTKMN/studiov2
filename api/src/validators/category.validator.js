const Joi = require('joi');

const categorySchemas = {
    create: Joi.object({
        category_name: Joi.string()
            .min(3)
            .max(100)
            .required()
            .messages({
                'string.min': 'Kategori adı en az 3 karakter olmalıdır',
                'string.max': 'Kategori adı en fazla 100 karakter olmalıdır',
                'any.required': 'Kategori adı zorunludur'
            }),
        category_description: Joi.string()
            .max(1000)
            .allow('', null)
            .messages({
                'string.max': 'Açıklama en fazla 1000 karakter olmalıdır'
            }),
        // Slug manuel olarak girilebilir ancak opsiyonel
        category_slug: Joi.string()
            .max(150)
            .pattern(/^[a-z0-9-]+$/)
            .allow('', null)
            .messages({
                'string.pattern.base': 'Slug sadece küçük harf, rakam ve tire içerebilir',
                'string.max': 'Slug en fazla 150 karakter olabilir'
            })
    }),

    update: Joi.object({
        category_name: Joi.string()
            .min(3)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Kategori adı en az 3 karakter olmalıdır',
                'string.max': 'Kategori adı en fazla 100 karakter olmalıdır'
            }),
        category_description: Joi.string()
            .max(1000)
            .allow('', null)
            .messages({
                'string.max': 'Açıklama en fazla 1000 karakter olmalıdır'
            })
    })
};

module.exports = categorySchemas;