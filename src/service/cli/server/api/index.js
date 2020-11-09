"use strict";

const {Router} = require(`express`);
const category = require(`./category`);
const {
  CategoryService,
  OffersService,
  SearchService,
  CommentsService,
} = require(`../data-service`);
const offers = require(`./offers`);
const search = require(`./search`);
const getMockData = require(`../../../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();
  category(app, new CategoryService(mockData));
  offers(app, new OffersService(mockData), new CommentsService());
  search(app, new SearchService(mockData));
})();

module.exports = app;
