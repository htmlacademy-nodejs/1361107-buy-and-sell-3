"use strict";

const Joi = require(`joi`);
const {NewOfferMessage} = require(`../../../../constants`);

module.exports = Joi.object({
  title: Joi.string().label(`Заголовок`).min(10).max(100).messages({
    "string.min": NewOfferMessage.MIN_TITLE_LENGTH,
    "string.max": NewOfferMessage.MAX_TITLE_LENGTH,
  }),
  description: Joi.string().label(`Описание`).min(50).max(1000).messages({
    "string.min": NewOfferMessage.MIN_DESCRIPTION_LENGTH,
    "string.max": NewOfferMessage.MAX_DESCRIPTION_LENGTH,
  }),
  cost: Joi.number().label(`Стоимость`).min(100).messages({
    "number.min": NewOfferMessage.MIN_COST_NUMBER,
  }),
  picture: Joi.string().label(`Фото`),
  categories: Joi.array().label(`Категории`).items(Joi.number()).min(1).messages({
    "number.base": NewOfferMessage.WRONG_CATEGORY,
    "array.min": NewOfferMessage.MIN_CATEGORY_ARRAY_LENGTH
  }),
  typeId: Joi.number()
    .label(`Тип объявления`)
    .valid(...[1, 2])
    .messages({
      "any.required": NewOfferMessage.REQUIRED_FIELD,
      "any.only": NewOfferMessage.WRONG_TYPE_ID,
    }),
});
