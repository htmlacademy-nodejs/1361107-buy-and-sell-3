"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);

module.exports = (service) => catchAsync(async (req, res, next) => {
  const {categoryId} = req.params;

  const category = await service.findOne(categoryId);

  if (!category) {
    return next(new AppError(ResponseMessage.DATA_NOT_FOUND, HttpCode.NOT_FOUND));
  }

  res.locals.category = category;

  return next();
});
