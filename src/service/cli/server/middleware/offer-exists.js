"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);

module.exports = (service) => (req, res, next) => {
  const {offerId} = req.params;

  const offer = service.findOne(offerId);

  if (!offer) {
    return res.status(HttpCode.NOT_FOUND).send(ResponseMessage.DATA_NOT_FOUND);
  }

  res.locals.offer = offer;

  return next();
};
