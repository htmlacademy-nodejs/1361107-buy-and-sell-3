"use strict";

const offerRequiredKeys = [
  `category`,
  `description`,
  `picture`,
  `title`,
  `cost`,
];

module.exports = (req, res, next) => {
  req.body = offerRequiredKeys.reduce((acc, key) => {
    if (req.body[key]) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});

  return next();
};
