"use strict";

const {Router} = require(`express`);
const {PAGINATION_OFFSET} = require(`../../constants`);
const {catchAsync, getCardColor, getPageList} = require(`../../utils`);
const api = require(`../api`).getAPI();

const searchRouter = new Router();

searchRouter.get(
    `/`,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      let {page, search} = req.query;
      page = Number(page) || 1;
      const {count: freshOffersCount, rows: freshOffers} = await api.getOffers();
      freshOffers.forEach((offer) => {
        offer.cardColor = getCardColor();
      });
      try {
        const {count, offers: results} = await api.search(search, page);

        results.forEach((offer) => {
          offer.cardColor = getCardColor();
        });

        const maxPage = Math.ceil(count / PAGINATION_OFFSET);
        const pageList = getPageList(page, maxPage);

        res.render(`search-result`, {
          page,
          maxPage,
          pageList,
          results,
          search,
          count,
          user,
          freshOffersCount,
          freshOffers
        });
      } catch (error) {
        res.render(`search-result`, {
          results: [],
          search,
          user,
          freshOffersCount,
          freshOffers
        });
      }
    })
);

module.exports = searchRouter;
