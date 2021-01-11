"use strict";

const {HELP_MESSAGE} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `api`});

module.exports = {
  name: `--help`,
  run() {
    logger.info(HELP_MESSAGE);
  },
};
