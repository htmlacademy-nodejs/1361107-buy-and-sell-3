'use strict';

const dotenv = require(`dotenv`);
const {ExitCode} = require(`./constants`);
const {getLogger} = require(`./service/lib/logger`);
const result = dotenv.config();

const logger = getLogger({name: `app`});

if (result.error) {
  logger.error(`Failed to configure environment variables.`);
  process.exit(ExitCode.ERROR);
}

module.exports = Object.assign({}, result.parsed);
