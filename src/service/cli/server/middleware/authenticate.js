"use strict";

const {HttpCode, UserErrorMessage} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);
const bcrypt = require(`bcrypt`);

module.exports = (service) =>
  catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    const user = await service.findByEmail(email);

    if (!user) {
      return next(
          new AppError(
              UserErrorMessage.USER_NOT_EXISTS,
              HttpCode.BAD_REQUEST,
              [
                {
                  message: UserErrorMessage.USER_NOT_EXISTS,
                  context: {key: `email`},
                },
              ]
          )
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return next(
          new AppError(UserErrorMessage.WRONG_DATA, HttpCode.BAD_REQUEST, [
            {
              message: UserErrorMessage.WRONG_DATA,
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
