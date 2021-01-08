"use strict";

const {HttpCode} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);

module.exports = (service) => catchAsync(async (req, res, next) => {
  const user = await service.findOne(req.body.userId);

  if (!user) {
    return next(new AppError(`Пользователя с id ${req.body.userId} не существует`, HttpCode.BAD_REQUEST));
  }

  return next();
});
