const Joi = require('joi');

const feedbackSchemas = {
    create: Joi.object({
        type: Joi.string()
            .valid('BUG', 'FEATURE', 'IMPROVEMENT', 'OTHER')
            .required()
            .messages({
                'any.required': 'Geri bildirim türü seçimi zorunludur',
                'any.only': 'Geçersiz geri bildirim türü'
            }),
        title: Joi.string()
            .min(5)
            .max(100)
            .required()
            .messages({
                'string.min': 'Başlık en az 5 karakter olmalıdır',
                'string.max': 'Başlık en fazla 100 karakter olmalıdır',
                'any.required': 'Başlık zorunludur'
            }),
        description: Joi.string()
            .min(10)
            .max(1000)
            .required()
            .messages({
                'string.min': 'Açıklama en az 10 karakter olmalıdır',
                'string.max': 'Açıklama en fazla 1000 karakter olmalıdır',
                'any.required': 'Açıklama zorunludur'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Geçerli bir email adresi giriniz',
                'any.required': 'Email adresi zorunludur'
            }),
        priority: Joi.string()
            .valid('LOW', 'MEDIUM', 'HIGH')
            .default('LOW')
            .messages({
                'any.only': 'Geçersiz öncelik seviyesi'
            })
    }),

    update: Joi.object({
        status: Joi.string()
            .valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')
            .messages({
                'any.only': 'Geçersiz durum'
            }),
        priority: Joi.string()
            .valid('LOW', 'MEDIUM', 'HIGH')
            .messages({
                'any.only': 'Geçersiz öncelik seviyesi'
            }),
        admin_notes: Joi.string()
            .max(500)
            .allow('', null)
            .messages({
                'string.max': 'Admin notu en fazla 500 karakter olmalıdır'
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
        type: Joi.string()
            .valid('BUG', 'FEATURE', 'IMPROVEMENT', 'OTHER'),
        status: Joi.string()
            .valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'),
        priority: Joi.string()
            .valid('LOW', 'MEDIUM', 'HIGH'),
        email: Joi.string()
            .email(),
        sort: Joi.string()
            .valid('latest', 'oldest', 'priority'),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(50),
        page: Joi.number()
            .integer()
            .min(1)
    })
};

module.exports = feedbackSchemas;
