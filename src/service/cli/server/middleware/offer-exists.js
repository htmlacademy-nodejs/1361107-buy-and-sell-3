"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const {AppError} = require(`../../../../utils`);

module.exports = (service) => async (req, res, next) => {
  const {offerId} = req.params;
  if (isNaN(Number(offerId))) {
    return next(new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST));
  }

  const offer = await service.findOne(offerId);

  if (!offer) {
    return next(new AppError(ResponseMessage.DATA_NOT_FOUND, HttpCode.NOT_FOUND));
  }

  res.locals.offer = offer;

  return next();
};
