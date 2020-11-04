"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const offerExists = require(`../middleware/offer-exists`);
const offerValidator = require(`../middleware/offer-validator`);
const commentValidator = require(`../middleware/comment-validator`);


module.exports = (app, offersService, commentsService) => {
  const route = new Router();

  route.get(`/`, (req, res) => {
    const offers = offersService.findAll();
    return res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, offerExists(offersService), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const newOffer = offersService.create(req.body);

    return res.status(HttpCode.CREATED).json(newOffer);
  });

  route.put(`/:offerId`, [offerExists(offersService), offerValidator], (req, res) => {
    const {offerId} = req.params;
    const updatedOffer = offersService.update(offerId, req.body);

    return res.status(HttpCode.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    offersService.delete(offerId);

    return res.status(HttpCode.NO_CONTENT).json({});
  });

  route.get(`/:offerId/comments`, offerExists(offersService), (req, res) => {
    const {offer} = res.locals;

    const comments = commentsService.findAll(offer);

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExists(offersService), (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;

    commentsService.delete(offer, commentId);

    return res.status(HttpCode.NO_CONTENT).json({});
  });

  route.post(`/:offerId/comments`, [offerExists(offersService), commentValidator], (req, res) => {
    const {offer} = res.locals;
    const newComment = commentsService.create(offer, req.body);

    return res.status(HttpCode.OK).json(newComment);
  });

  app.use(`/offers`, route);
};
