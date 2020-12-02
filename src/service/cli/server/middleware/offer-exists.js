"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {offerId} = req.params;

  let offer;

  try {
    offer = await service.findOne(offerId);
  } catch (error) {
    return res.status(HttpCode.BAD_REQUEST).send(ResponseMessage.BAD_REQUEST);
  }

  if (!offer) {
    return res.status(HttpCode.NOT_FOUND).send(ResponseMessage.DATA_NOT_FOUND);
  }

  res.locals.offer = offer;

  return next();
};
