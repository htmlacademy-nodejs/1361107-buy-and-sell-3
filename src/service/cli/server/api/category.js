"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const idValidator = require(`../middleware/id-validator`);
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

  route.get(
      `/:categoryId`,
      idValidator,
      catchAsync(async (req, res) => {
        const {categoryId} = req.params;
        const categories = await service.findOne(categoryId);
        res.status(HttpCode.OK).json(categories);
      })
  );

  app.use(`/categories`, route);
};
