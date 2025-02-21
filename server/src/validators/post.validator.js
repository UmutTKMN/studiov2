const Joi = require('joi');

const postSchemas = {
    create: Joi.object({
        post_title: Joi.string()
            .min(5)
            .max(255)
            .required()
            .messages({
                'string.min': 'Başlık en az 5 karakter olmalıdır',
                'string.max': 'Başlık en fazla 255 karakter olmalıdır',
                'any.required': 'Başlık zorunludur'
            }),
        post_excerpt: Joi.string()
            .max(500)
            .allow('', null)
            .messages({
                'string.max': 'Özet en fazla 500 karakter olmalıdır'
            }),
        post_content: Joi.string()
            .required()
            .messages({
                'any.required': 'İçerik zorunludur'
            }),
        post_category: Joi.number()
            .integer()
            .allow(null)
            .messages({
                'number.base': 'Geçersiz kategori ID'
            }),
        post_tags: Joi.string()
            .max(255)
            .allow('', null)
            .messages({
                'string.max': 'Etiketler en fazla 255 karakter olmalıdır'
            }),
        post_image: Joi.string()
            .max(255)
            .allow('', null)
            .messages({
                'string.max': 'Resim URL en fazla 255 karakter olmalıdır'
            }),
        post_status: Joi.string()
            .valid('draft', 'published', 'archived')
            .default('draft')
            .messages({
                'any.only': 'Geçersiz durum değeri'
            })
    }),

    update: Joi.object({
        post_title: Joi.string()
            .min(5)
            .max(255)
            .messages({
                'string.min': 'Başlık en az 5 karakter olmalıdır',
                'string.max': 'Başlık en fazla 255 karakter olmalıdır'
            }),
        post_excerpt: Joi.string()
            .max(500)
            .allow('', null)
            .messages({
                'string.max': 'Özet en fazla 500 karakter olmalıdır'
            }),
        post_content: Joi.string()
            .messages({
                'any.required': 'İçerik zorunludur'
            }),
        post_category: Joi.number()
            .integer()
            .allow(null)
            .messages({
                'number.base': 'Geçersiz kategori ID'
            }),
        post_tags: Joi.string()
            .max(255)
            .allow('', null)
            .messages({
                'string.max': 'Etiketler en fazla 255 karakter olmalıdır'
            }),
        post_image: Joi.string()
            .max(255)
            .allow('', null)
            .messages({
                'string.max': 'Resim URL en fazla 255 karakter olmalıdır'
            }),
        post_status: Joi.string()
            .valid('draft', 'published', 'archived')
            .default('draft')
            .messages({
                'any.only': 'Geçersiz durum değeri'
            })
    }),

    search: Joi.object({
        q: Joi.string()
            .min(2)
            .required()
            .messages({
                'string.min': 'Arama terimi en az 2 karakter olmalıdır',
                'any.required': 'Arama terimi zorunludur'
            })
    }),

    filter: Joi.object({
        category_id: Joi.number().integer(),
        user_id: Joi.number().integer(),
        sort: Joi.string().valid('latest', 'oldest', 'popular'),
        limit: Joi.number().integer().min(1).max(50),
        page: Joi.number().integer().min(1)
    })
};

module.exports = postSchemas;