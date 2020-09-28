"use strict";

const {Router} = require(`express`);
const mockData = require(`../../../../../mocks.json`);
const category = require(`./category`);
const {
  CategoryService,
  OffersService,
  SearchService,
  CommentsService,
} = require(`../data-service`);
const offers = require(`./offers`);
const search = require(`./search`);

const app = new Router();

category(app, new CategoryService(mockData));
offers(app, new OffersService(mockData), new CommentsService());
search(app, new SearchService(mockData));

module.exports = app;
