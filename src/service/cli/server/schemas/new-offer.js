"use strict";

const Joi = require(`joi`);
const {NewOfferMessage} = require(`../../../../constants`);

module.exports = Joi.object({
  title: Joi.string().required().min(10).max(100).messages({
    "string.min": NewOfferMessage.MIN_TITLE_LENGTH,
    "string.max": NewOfferMessage.MAX_TITLE_LENGTH,
    "any.required": NewOfferMessage.REQUIRED_FIELD,
  }),
  description: Joi.string().required().min(50).max(1000).messages({
    "string.min": NewOfferMessage.MIN_DESCRIPTION_LENGTH,
    "string.max": NewOfferMessage.MAX_DESCRIPTION_LENGTH,
    "any.required": NewOfferMessage.REQUIRED_FIELD,
  }),
  cost: Joi.number().min(100).required().messages({
    "number.min": NewOfferMessage.MIN_COST_NUMBER,
    "any.required": NewOfferMessage.REQUIRED_FIELD,
  }),
  picture: Joi.string()
    .required()
    .messages({"any.required": NewOfferMessage.REQUIRED_FIELD}),
  typeId: Joi.number().valid(...[1, 2]).required().messages({
    "any.required": NewOfferMessage.REQUIRED_FIELD,
    "any.only": NewOfferMessage.WRONG_TYPE_ID,
  }),
  userId: Joi.number()
    .required()
    .messages({"any.required": NewOfferMessage.REQUIRED_FIELD}),
  category: Joi.array()
    .items(Joi.number())
    .required()
    .messages({
      "any.required": NewOfferMessage.REQUIRED_FIELD,
      "number.base": NewOfferMessage.WRONG_CATEGORY
    }),
});
