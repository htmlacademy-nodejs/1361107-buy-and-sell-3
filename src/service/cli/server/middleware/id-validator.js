"use strict";

const {ResponseMessage, HttpCode} = require(`../../../../constants`);
const {AppError} = require(`../../../../utils`);

module.exports = (req, res, next) => {
  const {offerId, commentId} = req.params;

  if (isNaN(Number(offerId))) {
    return next(
        new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
    );
  }

  if (commentId) {
    if (isNaN(Number(commentId))) {
      return next(
          new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
      );
    }
  }

  return next();
};
