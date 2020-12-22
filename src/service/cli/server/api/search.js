"use strict";

const {Router} = require(`express`);
const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);

module.exports = (app, service) => {
  const route = new Router();

  route.get(
      `/`,
      catchAsync(async (req, res, next) => {
        let {search, page} = req.query;
        page = page ? Number(page) : 1;

        if (!search) {
          return next(
              new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
          );
        }

        const result = await service.findAll(search, page);
        if (result.offers.length === 0) {
          return res
          .status(HttpCode.NOT_FOUND)
          .send(ResponseMessage.DATA_NOT_FOUND);
        }
        return res.status(HttpCode.OK).json(result);
      })
  );

  app.use(`/search`, route);
};
