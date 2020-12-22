"use strict";

const {Router} = require(`express`);
const {PAGINATION_OFFSET} = require(`../../constants`);
const {catchAsync, getCardColor, getPageList} = require(`../../utils`);
const api = require(`../api`).getAPI();

const searchRouter = new Router();

searchRouter.get(
    `/`,
    catchAsync(async (req, res) => {
      let {page, search} = req.query;
      page = Number(page) || 1;
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
        });
      } catch (error) {
        res.render(`search-result`, {
          results: [],
          search,
        });
      }
    })
);

module.exports = searchRouter;
