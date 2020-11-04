"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));
offersRouter.get(`/add`, (req, res) => res.render(`new-ticket`));
offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);
  res.render(`ticket-edit`, {offer, categories});
});
offersRouter.get(`/:id`, (req, res) => res.render(`ticket`));

module.exports = offersRouter;
