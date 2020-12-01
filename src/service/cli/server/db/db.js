"use strict";

const Sequelize = require(`sequelize`);
const config = require(`../../../../config`);
const {getLogger} = require(`../../../lib/logger`);

const logger = getLogger({name: `database`});

const sequelize = new Sequelize(
    config.DB_NAME,
    config.DB_USER,
    config.DB_PASSWORD,
    {
      host: config.DB_HOST,
      dialect: `postgres`,
      logging: (msg) => logger.info(msg)
    }
);

module.exports = {
  sequelize,
};
