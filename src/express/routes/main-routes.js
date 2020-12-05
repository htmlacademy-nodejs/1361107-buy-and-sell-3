"use strict";

const {Router} = require(`express`);
const {getCardColor, catchAsync} = require(`../../utils`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(
    `/`,
    catchAsync(async (req, res) => {
      const listOffers = await api.getOffers();
      listOffers.forEach((offer) => {
        offer.cardColor = getCardColor();
      });
      res.render(`main`, {listOffers});
    })
);

module.exports = mainRouter;
