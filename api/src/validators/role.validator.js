const Joi = require('joi');

const roleSchemas = {
    create: Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.min': 'Rol adı en az 3 karakter olmalıdır',
                'string.max': 'Rol adı en fazla 30 karakter olmalıdır',
                'any.required': 'Rol adı zorunludur'
            }),
        description: Joi.string()
            .max(100)
            .messages({
                'string.max': 'Açıklama en fazla 100 karakter olmalıdır'
            })
    }),

    update: Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .messages({
                'string.min': 'Rol adı en az 3 karakter olmalıdır',
                'string.max': 'Rol adı en fazla 30 karakter olmalıdır'
            }),
        description: Joi.string()
            .max(100)
            .messages({
                'string.max': 'Açıklama en fazla 100 karakter olmalıdır'
            })
    }),

    assign: Joi.object({
        roleId: Joi.number()
            .integer()
            .required()
            .messages({
                'any.required': 'Rol ID zorunludur'
            })
    })
};

module.exports = roleSchemas; 