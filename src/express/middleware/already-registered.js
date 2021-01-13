"use strict";

module.exports = (req, res, next) => {
  const {user} = req.session;

  if (user) {
    res.redirect(`/`);
  }

  return next();
};
