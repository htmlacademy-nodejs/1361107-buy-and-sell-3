"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const {catchAsync} = require(`../../../../utils`);

module.exports = (app, service) => {
  const route = new Router();

  route.post(
      `/`,
      catchAsync(async (req, res) => {
        const newUser = await service.create(req.body);

        return res.status(HttpCode.OK).json(newUser);
      })
  );

  app.use(`/user`, route);
};
