"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);

const commentRequiredKeys = [`text`, `userId`];

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
    return res.status(HttpCode.BAD_REQUEST).send(ResponseMessage.BAD_REQUEST);
  }

  return next();
};
