const Joi = require("joi");

const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),
    password: Joi.string().min(8).required(),
    password_confirmation: Joi.string().required(),
    promoCode: Joi.string().optional(),
    terms: Joi.boolean().required().valid(true)
});

const validateForm = (req, res, next) => {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
        return res.status(500).json({ error: error.details[0].message });
    }

    next();


};


module.exports = validateForm;