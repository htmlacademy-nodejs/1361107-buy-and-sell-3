"use strict";

const {ResponseMessage, HttpCode} = require(`../../../../constants`);
const {AppError} = require(`../../../../utils`);

module.exports = (schema) => async (req, res, next) => {
  const {body} = req;
  try {
    await schema.validateAsync(body, {abortEarly: false});
  } catch (err) {
    const {details} = err;

    console.log(details);
    next(new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST));
  }

  next();
};
