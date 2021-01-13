"use strict";

const {Router} = require(`express`);
const category = require(`./category`);
const {
  CategoryService,
  OffersService,
  SearchService,
  CommentsService,
  UsersService
} = require(`../data-service`);
const offers = require(`./offers`);
const search = require(`./search`);
const {db} = require(`../db/db`);
const users = require(`./users`);

const app = new Router();

category(app, new CategoryService(db));
offers(app, {
  offersService: new OffersService(db),
  commentsService: new CommentsService(db),
  categoryService: new CategoryService(db),
  usersService: new UsersService(db)
});
search(app, new SearchService(db));
users(app, new UsersService(db));

module.exports = app;
