"use strict";

module.exports.DEFAULT_COMMAND = `--help`;

module.exports.USER_ARGV_INDEX = 2;

module.exports.ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

module.exports.MAX_ADS_NUMBER = 1000;

module.exports.AdType = {
  OFFER: `offer`,
  SALE: `sale`,
};

module.exports.MAX_DESCR_SIZE = 5;

module.exports.SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

module.exports.PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

module.exports.MOCKS_FILE_NAME = `mocks.json`;

module.exports.DEFAULT_AD_AMOUNT = 1;
