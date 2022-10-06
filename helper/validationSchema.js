const Joi = require('@hapi/joi');

const companySchema = Joi.object({
    name: Joi.string().required(),
    url: Joi.string().domain().require(),
    total: Joi.number().required(),
    contributions: Joi.array().items(Joi.number().required()).required(),
    top_three: Joi.array().items(Joi.string().required()).required()
});

const postingSchema = Joi.object({
    password: Joi.string().required(),
    name: Joi.string().required(),
    url: Joi.string().domain().require(),
    total: Joi.number().required(),
    contributions: Joi.array().items(Joi.number().required()).required(),
    top_three: Joi.array().items(Joi.string().required()).required()
});

module.exports = {
    companySchema, 
    postingSchema
}