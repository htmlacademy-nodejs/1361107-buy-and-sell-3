"use strict";

const {HttpCode} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);
const bcrypt = require(`bcrypt`);

module.exports = (service) => catchAsync(async (req, res, next) => {
  const {email, password} = req.body;

  const user = await service.findByEmail(email);

  if (!user) {
    return next(new AppError(`Пользователя с таким email не существует`, HttpCode.BAD_REQUEST));
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return next(new AppError(`Неверный email или пароль`, HttpCode.BAD_REQUEST));
  }

  res.locals.user = user;

  return next();
});
