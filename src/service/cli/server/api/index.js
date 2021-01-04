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
offers(app, {
  offersService: new OffersService(db),
  commentsService: new CommentsService(db),
  categoryService: new CategoryService(db),
});
search(app, new SearchService(db));

module.exports = app;
