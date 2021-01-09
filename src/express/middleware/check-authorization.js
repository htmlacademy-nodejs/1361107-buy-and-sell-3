"use strict";

const {HttpCode, ResponseMessage} = require(`../../constants`);

module.exports = (req, res, next) => {
  const {user} = req.session;
  const {id: offerId} = req.params;
  if (!user.offers.includes(Number(offerId))) {
    res
      .status(HttpCode.BAD_REQUEST)
      .render(`errors/400`, {
        statusCode: HttpCode.FORBIDDEN,
        message: ResponseMessage.FORBIDDEN,
      });
  }

  return next();
};
