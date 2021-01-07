"use strict";

const Joi = require(`joi`);
const {NewUserMessage} = require(`../../../../constants`);

module.exports = Joi.object({
  firstName: Joi.string().label(`Имя`).required().max(30).messages({
    "string.max": NewUserMessage.MAX_FIRST_NAME_LENGTH,
    "any.required": NewUserMessage.REQUIRED_FIELD,
  }),
  lastName: Joi.string().label(`Фамилия`).required().max(30).messages({
    "string.max": NewUserMessage.MAX_LAST_NAME_LENGTH,
    "any.required": NewUserMessage.REQUIRED_FIELD,
  }),
  password: Joi.string().label(`Пароль`).min(6).required().messages({
    "string.min": NewUserMessage.MIN_PASSWORD_LENGTH,
    "any.required": NewUserMessage.REQUIRED_FIELD,
  }),
  repeatPassword: Joi.string().label(`Повторно введенный пароль`).required().valid(Joi.ref(`password`)).messages({
    "any.only": NewUserMessage.PASSWORDS_NOT_EQUALS,
    "any.required": NewUserMessage.REQUIRED_FIELD,
  }),
  avatar: Joi.string().label(`Фото`),
  email: Joi.string().label(`Email`).email().required().messages({
    "any.required": NewUserMessage.REQUIRED_FIELD,
    "string.email": NewUserMessage.WRONG_EMAIL
  }),
});
