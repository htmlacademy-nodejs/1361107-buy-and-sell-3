"use strict";

const {Router} = require(`express`);
const {PAGINATION_OFFSET} = require(`../../constants`);
const {getCardColor, getPageList} = require(`../../utils`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const page = Number(req.query.page) || 1;
  const {count, rows: listOffers} = await api.getOffers(page);
  listOffers.forEach((offer) => {
    offer.cardColor = getCardColor();
  });
  const maxPage = Math.ceil(count / PAGINATION_OFFSET);
  const pageList = getPageList(page, maxPage);
  res.render(`my-tickets`, {page, maxPage, pageList, listOffers});
});

myRouter.get(`/comments`, async (req, res) => {
  const listOffers = await api.getOffers();
  res.render(`comments`, {listOffers: listOffers.slice(0, 3)});
});

module.exports = myRouter;
