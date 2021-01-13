'use strict';

const {MOCKS_FILE_NAME} = require(`../../constants`);
const {getLogger} = require(`./logger`);

const logger = getLogger({name: `api`});

const fs = require(`fs`).promises;
let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(MOCKS_FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    logger.error(err);
  }

  return data;
};

module.exports = getMockData;
