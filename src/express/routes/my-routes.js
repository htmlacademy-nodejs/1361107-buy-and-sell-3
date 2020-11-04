"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const listOffers = await api.getOffers();
  res.render(`my-tickets`, {listOffers});
});
myRouter.get(`/comments`, async (req, res) => {
  const listOffers = await api.getOffers();
  res.render(`comments`, {listOffers: listOffers.slice(0, 3)});
});

module.exports = myRouter;
