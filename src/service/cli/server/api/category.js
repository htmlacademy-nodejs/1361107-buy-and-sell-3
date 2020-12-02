"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);


module.exports = (app, service) => {
  const route = new Router();

  route.get(`/`, async (req, res) => {
    const categories = await service.findAll();
    res.status(HttpCode.OK).json(categories);
  });

  app.use(`/categories`, route);
};
