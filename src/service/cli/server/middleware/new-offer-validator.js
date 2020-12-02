"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const {AppError} = require(`../../../../utils`);

const offerRequiredKeys = [
  `category`,
  `description`,
  `picture`,
  `title`,
  `cost`,
  `typeId`,
  `userId`,
];

module.exports = (req, res, next) => {
  req.body = offerRequiredKeys.reduce((acc, key) => {
    if (req.body[key]) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});
  const offerKeys = Object.keys(req.body);
  const isKeysMatch = offerRequiredKeys.every((key) => offerKeys.includes(key));

  if (!isKeysMatch) {
    return next(new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST));
  }

  return next();
};
