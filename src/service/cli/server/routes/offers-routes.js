"use strict";

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const {MOCKS_FILE_NAME} = require(`../../../../constants`);

const offersRouter = new Router();

offersRouter.get(`/`, async (req, res) => {
  try {
    const mocks = await fs.readFile(MOCKS_FILE_NAME);
    const ads = JSON.parse(mocks);
    res.json(ads);
  } catch (error) {
    res.json([]);
  }
});

module.exports = offersRouter;
