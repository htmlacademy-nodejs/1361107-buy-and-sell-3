"use strict";

const {HttpCode, ResponseMessage} = require(`../../constants`);
const {catchAsync} = require(`../../utils`);
const api = require(`../api`).getAPI();

module.exports = catchAsync(async (req, res, next) => {
  const {user} = req.session;
  const {id: offerId} = req.params;
  const offer = await api.getOffer(offerId);

  if (!offer.owner.email !== user.email) {
    res.status(HttpCode.BAD_REQUEST).render(`errors/400`, {
      statusCode: HttpCode.FORBIDDEN,
      message: ResponseMessage.FORBIDDEN,
    });
  }

  return next();
});
