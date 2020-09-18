"use strict";

const {HttpCode, ResponceMessage} = require(`../../../../constants`);

const commentRequiredKeys = [`text`];

module.exports = (req, res, next) => {
  req.body = commentRequiredKeys.reduce((acc, key) => {
    if (req.body[key]) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});
  const commentKeys = Object.keys(req.body);
  const isKeysMatch = commentRequiredKeys.every((key) =>
    commentKeys.includes(key)
  );

  if (!isKeysMatch) {
    return res.status(HttpCode.BAD_REQUEST).send(ResponceMessage.BAD_REQUEST);
  }

  return next();
};
