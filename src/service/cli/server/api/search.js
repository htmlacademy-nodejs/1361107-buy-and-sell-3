"use strict";

const {Router} = require(`express`);
const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);

module.exports = (app, service) => {
  const route = new Router();

  route.get(
      `/`,
      catchAsync(async (req, res, next) => {
        const {query} = req.query;

        if (!query) {
          return next(
              new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
          );
        }

        const searchResult = await service.findAll(query);
        if (searchResult.length === 0) {
          return res
          .status(HttpCode.NOT_FOUND)
          .send(ResponseMessage.DATA_NOT_FOUND);
        }
        return res.status(HttpCode.OK).json(searchResult);
      })
  );

  app.use(`/search`, route);
};
