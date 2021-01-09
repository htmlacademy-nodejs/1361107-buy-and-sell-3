"use strict";

const {HttpCode} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);

module.exports = (offersService) => catchAsync(async (req, res, next) => {
  let {offer} = res.locals;
  if (!offer) {
    const {offerId} = req.params;
    offer = await offersService.findOne(offerId);
    if (!offer) {
      return next();
    }
  }

  const {userEmail} = req.query;

  if (userEmail !== offer.owner.email) {
    return next(new AppError(`У пользователя нет прав на данное действие`, HttpCode.FORBIDDEN));
  }

  return next();
});
