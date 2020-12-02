"use strict";

const {HttpCode, DBErrorName} = require(`../../../../constants`);
const {AppError} = require(`../../../../utils`);
const {getLogger} = require(`../../../lib/logger`);

const logger = getLogger({name: `api`});

const handleForeignKeyErrorDB = (err) => {
  const message = `Failed to insert or update table: ${err.parent.detail}`;
  return new AppError(message, HttpCode.BAD_REQUEST);
};

const handleDatabaseErrorDB = (err) => {
  const message = `Invalid data: ${err.message}`;
  return new AppError(message, HttpCode.BAD_REQUEST);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(`. `)}`;
  return new AppError(message, HttpCode.BAD_REQUEST);
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).send(err.message);
  } else {
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .send(`Something went very wrong`);
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

module.exports = (err, req, res) => {
  err.statusCode = err.statusCode || HttpCode.INTERNAL_SERVER_ERROR;

  logger.error(`An error occured: ${err}`);

  if (process.env.NODE_ENV === `development`) {
    sendErrorDev(err, res);
    return;
  }
  if (process.env.NODE_ENV === `production`) {
    let error = {...err, message: err.message};

    switch (error.name) {
      case DBErrorName.FOREIGN_KEY_ERROR:
        error = handleForeignKeyErrorDB(error);
        break;
      case DBErrorName.DATABASE_ERROR:
        error = handleDatabaseErrorDB(error);
        break;
      case DBErrorName.VALIDATION_ERROR:
        error = handleValidationErrorDB(error);
        break;
      default:
        break;
    }

    sendErrorProd(error, res);
  }
};
