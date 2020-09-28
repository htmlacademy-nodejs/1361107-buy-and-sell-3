"use strict";

const {HttpCode, ResponceMessage} = require(`../../../../constants`);

const offerRequiredKeys = [
  `category`,
  `description`,
  `picture`,
  `title`,
  `type`,
  `sum`,
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
    return res.status(HttpCode.BAD_REQUEST).send(ResponceMessage.BAD_REQUEST);
  }

  return next();
};
