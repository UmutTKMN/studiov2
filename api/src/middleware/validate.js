const { ErrorHandler } = require('./error');

const validate = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body);
            
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => ({
                        message: detail.message,
                        path: detail.path
                    }))
                });
            }

            next();
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Validation middleware error',
                error: err.message
            });
        }
    };
};

module.exports = validate;