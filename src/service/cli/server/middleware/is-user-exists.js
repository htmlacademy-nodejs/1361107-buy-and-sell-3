"use strict";

const {HttpCode, UserErrorMessage} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);

module.exports = (service) => catchAsync(async (req, res, next) => {
  const user = await service.findOne(req.body.userId);

  if (!user) {
    return next(new AppError(UserErrorMessage.USER_NOT_EXISTS, HttpCode.BAD_REQUEST));
  }

  return next();
});
