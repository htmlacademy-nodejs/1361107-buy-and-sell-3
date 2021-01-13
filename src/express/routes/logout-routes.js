"use strict";

const {Router} = require(`express`);
const privateRoute = require(`../middleware/private-route`);

const logoutRouter = new Router();

logoutRouter.get(`/`, privateRoute, (req, res) => {
  req.session.destroy(() =>{
    res.redirect(`/`);
  });
});

module.exports = logoutRouter;
