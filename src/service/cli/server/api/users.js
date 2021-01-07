"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const {catchAsync} = require(`../../../../utils`);
const schemaValidator = require(`../middleware/schema-validator`);
const newUserSchema = require(`../schemas/new-user`);

module.exports = (app, service) => {
  const route = new Router();

  route.post(
      `/`,
      schemaValidator(newUserSchema),
      catchAsync(async (req, res) => {
        const newUser = await service.create(req.body);

        return res.status(HttpCode.OK).json(newUser);
      })
  );

  app.use(`/user`, route);
};
