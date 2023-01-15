const Joi = require('joi');

const loginBodySchema = Joi.object().keys({
    email : Joi.string().email(),
    username : Joi.string().max(15),
}).or('email','username')

module.exports = loginBodySchema;