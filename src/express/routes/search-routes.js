"use strict";

const {Router} = require(`express`);
const {catchAsync} = require(`../../utils`);
const api = require(`../api`).getAPI();

const searchRouter = new Router();

searchRouter.get(
    `/`,
    catchAsync(async (req, res) => {
      const {search} = req.query;
      try {
        const results = await api.search(search);

        res.render(`search-result`, {
          results,
          search,
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
