"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const {AppError} = require(`../../../../utils`);

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
    return next(new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST));
  }

  return next();
};
