"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const listOffers = await api.getOffers();
  res.render(`main`, {listOffers});
});

module.exports = mainRouter;
