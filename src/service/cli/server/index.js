"use strict";

const express = require(`express`);
const {
  ExitCode,
  DEFAULT_API_PORT,
  HttpCode,
  ResponseMessage,
  API_PREFIX,
} = require(`../../../constants`);
const {getLogger} = require(`../../lib/logger`);
const routes = require(`./api`);

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
  res.status(HttpCode.NOT_FOUND).send(ResponseMessage.API_ROUTE_NOT_FOUND);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  run(args) {
    const port = Number.parseInt(args[0], 10) || DEFAULT_API_PORT;

    app.listen(port, (err) => {
      if (err) {
        logger.error(`An error occured on server creation: ${err.message}`);
        process.exit(ExitCode.ERROR);
      }

      logger.info(`Listening to connections on ${port}`);
    });
  },
};
