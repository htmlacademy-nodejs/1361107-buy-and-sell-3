"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const {catchAsync} = require(`../../../../utils`);

module.exports = (app, service) => {
  const route = new Router();

  route.get(
      `/`,
      catchAsync(async (req, res) => {
        const categories = await service.findAll();
        res.status(HttpCode.OK).json(categories);
      })
  );

  app.use(`/categories`, route);
};
