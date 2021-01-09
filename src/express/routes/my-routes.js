"use strict";

const {Router} = require(`express`);
const {PAGINATION_OFFSET} = require(`../../constants`);
const {getCardColor, getPageList, catchAsync} = require(`../../utils`);
const privateRoute = require(`../middleware/private-route`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(
    `/`,
    privateRoute,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const page = Number(req.query.page) || 1;
      const {count, rows: listOffers} = await api.getMyOffers(page, user.email);
      listOffers.forEach((offer) => {
        offer.cardColor = getCardColor();
      });
      const maxPage = Math.ceil(count / PAGINATION_OFFSET);
      const pageList = getPageList(page, maxPage);
      res.render(`my-tickets`, {
        page,
        maxPage,
        pageList,
        listOffers,
        user,
        navPage: `offers`,
      });
    })
);

myRouter.get(
    `/comments`,
    privateRoute,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {rows: listOffers} = await api.getOffers();
      res.render(`comments`, {
        listOffers: listOffers.slice(0, 3),
        user,
        navPage: `comments`,
      });
    })
);

module.exports = myRouter;
