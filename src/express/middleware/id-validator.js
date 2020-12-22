"use strict";

const {ResponseMessage, HttpCode} = require(`../../constants`);

module.exports = (req, res, next) => {
  const {offerId} = req.params;

  if (isNaN(Number(offerId))) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .render(`errors/400`, {
        statusCode: HttpCode.BAD_REQUEST,
        message: ResponseMessage.BAD_REQUEST,
      });
  }

  return next();
};
