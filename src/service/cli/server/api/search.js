"use strict";

const {Router} = require(`express`);
const {HttpCode, ResponceMessage} = require(`../../../../constants`);

const route = new Router();

module.exports = (app, service) => {
  route.get(`/`, (req, res) => {
    const {query} = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).send(ResponceMessage.BAD_REQUEST);
    }

    const searchResult = service.findAll(query);
    return searchResult.length > 0
      ? res.status(HttpCode.OK).json(searchResult)
      : res.status(HttpCode.NOT_FOUND).send(ResponceMessage.DATA_NOT_FOUND);
  });

  app.use(`/search`, route);
};
