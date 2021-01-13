"use strict";

const packageData = require(`../../../package.json`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `api`});

module.exports = {
  name: `--version`,
  run() {
    logger.info(packageData.version);
  },
};
