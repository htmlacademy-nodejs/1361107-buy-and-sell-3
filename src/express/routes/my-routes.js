"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const listOffers = await api.getOffers();
  res.render(`my-tickets`, {listOffers});
});
myRouter.get(`/comments`, (req, res) => res.render(`comments`));

module.exports = myRouter;
