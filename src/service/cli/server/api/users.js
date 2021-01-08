"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const {catchAsync} = require(`../../../../utils`);
const authenticate = require(`../middleware/authenticate`);
const schemaValidator = require(`../middleware/schema-validator`);
const loginUserSchema = require(`../schemas/login-user`);
const newUserSchema = require(`../schemas/new-user`);

module.exports = (app, service) => {
  const route = new Router();

  route.post(
      `/signup`,
      schemaValidator(newUserSchema),
      catchAsync(async (req, res) => {
        const newUser = await service.create(req.body);

        return res.status(HttpCode.OK).json(newUser);
      })
  );

  route.post(
      `/login`,
      schemaValidator(loginUserSchema),
      authenticate(service),
      (req, res) => {
        res.status(HttpCode.OK).json(res.locals.user);
      }
  );

  app.use(`/user`, route);
};
