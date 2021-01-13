"use strict";

const pino = require(`pino`);
const config = require(`../../config`);
const {Env} = require(`../../constants`);

const LOG_FILE = `./logs/front.log`;
const isDevMode = config.NODE_ENV === Env.DEVELOPMENT;
const defaultLogLevel = isDevMode ? `info` : `error`;

const logger = pino(
    {
      name: `base-logger`,
      level: config.LOG_LEVEL || defaultLogLevel,
      prettyPrint: true,
    },
    isDevMode ? process.stdout : pino.destination(LOG_FILE)
);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  },
};
