"use strict";

const {HttpCode} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);
const bcrypt = require(`bcrypt`);

module.exports = (service) =>
  catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    const user = await service.findByEmail(email);

    if (!user) {
      return next(
          new AppError(
              `Пользователя с таким email не существует`,
              HttpCode.BAD_REQUEST,
              [
                {
                  message: `Пользователя с таким email не существует`,
                  context: {key: `email`},
                },
              ]
          )
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return next(
          new AppError(`Неверный email или пароль`, HttpCode.BAD_REQUEST, [
            {
              message: `Неверный email или пароль`,
              context: {key: `password`},
            },
          ])
      );
    }

    res.locals.user = user;

    return next();
  });
