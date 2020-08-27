"use strict";

const packageData = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    console.log(packageData.version);
  },
};
