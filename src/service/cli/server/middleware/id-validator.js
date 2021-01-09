"use strict";

const {ResponseMessage, HttpCode} = require(`../../../../constants`);
const {AppError} = require(`../../../../utils`);

module.exports = (req, res, next) => {
  const {offerId, commentId, categoryId, id} = req.params;

  for (const el of [offerId, commentId, categoryId, id]) {
    if (el && isNaN(Number(el))) {
      return next(
          new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
      );
    }
  }

  return next();
};
