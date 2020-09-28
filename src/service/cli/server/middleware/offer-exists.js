"use strict";

const {HttpCode, ResponceMessage} = require(`../../../../constants`);

module.exports = (service) => (req, res, next) => {
  const {offerId} = req.params;

  const offer = service.findOne(offerId);

  if (!offer) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(ResponceMessage.DATA_NOT_FOUND);
  }

  res.locals.offer = offer;

  return next();
};
