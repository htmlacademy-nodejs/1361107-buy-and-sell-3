"use strict";

const Joi = require(`joi`);
const {NewUserMessage} = require(`../../../../constants`);

module.exports = Joi.object({
  password: Joi.string().label(`Пароль`).required().messages({
    "string.min": NewUserMessage.MIN_PASSWORD_LENGTH,
    "any.required": NewUserMessage.REQUIRED_FIELD,
  }),
  email: Joi.string().label(`Email`).email().required().messages({
    "any.required": NewUserMessage.REQUIRED_FIELD,
    "string.email": NewUserMessage.WRONG_EMAIL
  }),
});
