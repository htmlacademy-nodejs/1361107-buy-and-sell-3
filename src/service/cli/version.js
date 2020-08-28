"use strict";

const packageData = require(`../../../package.json`);
const chalk = require(`chalk`);

module.exports = {
  name: `--version`,
  run() {
    console.log(chalk.blue(packageData.version));
  },
};
