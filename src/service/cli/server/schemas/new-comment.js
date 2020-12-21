"use strict";

const Joi = require(`joi`);
const {NewCommentMessage} = require(`../../../../constants`);

module.exports = Joi.object({
  text: Joi.string()
    .label(`Текст комментария`)
    .required()
    .min(20)
    .max(200)
    .messages({
      "string.min": NewCommentMessage.MIN_TEXT_LENGTH,
      "string.max": NewCommentMessage.MAX_TEXT_LENGTH,
      "any.required": NewCommentMessage.REQUIRED_FIELD,
    }),
  userId: Joi.number()
    .label(`ID пользователя`)
    .required()
    .messages({"any.required": NewCommentMessage.REQUIRED_FIELD}),
});
