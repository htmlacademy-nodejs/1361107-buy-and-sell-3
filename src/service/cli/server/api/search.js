"use strict";

const {Router} = require(`express`);
const {HttpCode, ResponseMessage} = require(`../../../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  route.get(`/`, async (req, res) => {
    const {query} = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).send(ResponseMessage.BAD_REQUEST);
    }

    const searchResult = await service.findAll(query);
    return searchResult.length > 0
      ? res.status(HttpCode.OK).json(searchResult)
      : res.status(HttpCode.NOT_FOUND).send(ResponseMessage.DATA_NOT_FOUND);
  });

  app.use(`/search`, route);
};
