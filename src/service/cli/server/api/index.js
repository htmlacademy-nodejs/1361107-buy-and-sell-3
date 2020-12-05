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
const {db} = require(`../db/db`);

const app = new Router();

category(app, new CategoryService(db));
offers(app, new OffersService(db), new CommentsService(db));
search(app, new SearchService(db));

module.exports = app;
