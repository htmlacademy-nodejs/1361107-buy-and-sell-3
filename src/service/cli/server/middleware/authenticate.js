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

    const filteredUserData = {...user.dataValues};

    delete filteredUserData.password;

    filteredUserData.offers = filteredUserData.offers.map((offer) => {
      return offer.id;
    });

    res.locals.user = filteredUserData;

    return next();
  });
