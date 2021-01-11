"use strict";

const {Router} = require(`express`);
const {PAGINATION_OFFSET} = require(`../../constants`);
const {getCardColor, catchAsync, getPageList} = require(`../../utils`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(
    `/`,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const page = Number(req.query.page) || 1;
      const {count, rows: listOffers} = await api.getOffers(page);
      const discussedOffers = await api.getDicussedOffers();
      listOffers.forEach((offer) => {
        offer.cardColor = getCardColor();
      });
      discussedOffers.forEach((offer) => {
        offer.cardColor = getCardColor();
      });
      const categories = await api.getCategories();
      const maxPage = Math.ceil(count / PAGINATION_OFFSET);
      const pageList = getPageList(page, maxPage);
      return res.render(`main`, {
        page,
        maxPage,
        pageList,
        listOffers,
        categories,
        user,
        discussedOffers
      });
    })
);

module.exports = mainRouter;
