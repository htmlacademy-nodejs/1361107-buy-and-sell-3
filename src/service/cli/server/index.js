"use strict";

const express = require(`express`);
const config = require(`../../../config`);
const {
  ExitCode,
  HttpCode,
  ResponseMessage,
  API_PREFIX,
  ServerMessage,
} = require(`../../../constants`);
const {getLogger} = require(`../../lib/logger`);
const routes = require(`./api`);
const {sequelize} = require(`./db/db`);
const globalErrorHandler = require(`./middleware/global-error-handler`);

const logger = getLogger({name: `api`});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).json({message: ResponseMessage.API_ROUTE_NOT_FOUND});
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, req, res, _next) => {
  globalErrorHandler(err, req, res);
});

module.exports = {
  name: `--server`,
  run: async (args) => {
    const port = Number.parseInt(args[0], 10) || config.API_PORT;

    try {
      logger.info(`Establishing database connection...`);
      await sequelize.authenticate();
      logger.info(`Database connection established`);
    } catch (err) {
      logger.error(`Failed to connect to database: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    app.listen(port, (err) => {
      if (err) {
        logger.error(`${ServerMessage.START_ERROR} ${err.message}`);
        process.exit(ExitCode.ERROR);
      }

      logger.info(`${ServerMessage.START_SUCCESSFUL} ${config.API_PORT}`);
    });
  },
};
