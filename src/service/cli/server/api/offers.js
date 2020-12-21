"use strict";

const {Router} = require(`express`);
const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const offerExists = require(`../middleware/offer-exists`);
const {catchAsync, AppError} = require(`../../../../utils`);
const schemaValidator = require(`../middleware/schema-validator`);
const newOfferSchema = require(`../schemas/new-offer`);
const newCommentSchema = require(`../schemas/new-comment`);
const updateOfferSchema = require(`../schemas/update-offer`);

module.exports = (app, offersService, commentsService) => {
  const route = new Router();

  route.get(
      `/`,
      catchAsync(async (req, res) => {
        const page = Number(req.query.page) || 1;
        const result = await offersService.findAll(page);

        return res.status(HttpCode.OK).json(result);
      })
  );

  route.get(`/:offerId`, offerExists(offersService), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(
      `/`,
      schemaValidator(newOfferSchema),
      catchAsync(async (req, res) => {
        const newOffer = await offersService.create(req.body);

        return res.status(HttpCode.CREATED).json(newOffer);
      })
  );

  route.put(
      `/:offerId`,
      [offerExists(offersService), schemaValidator(updateOfferSchema)],
      catchAsync(async (req, res) => {
        const {offerId} = req.params;

        const updatedOffer = await offersService.update(offerId, req.body);

        return res.status(HttpCode.OK).json(updatedOffer);
      })
  );

  route.delete(
      `/:offerId`,
      catchAsync(async (req, res, next) => {
        const {offerId} = req.params;

        if (isNaN(Number(offerId))) {
          return next(
              new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
          );
        }

        await offersService.delete(offerId);
        return res.status(HttpCode.NO_CONTENT).json({});
      })
  );

  route.get(
      `/:offerId/comments`,
      offerExists(offersService),
      catchAsync(async (req, res) => {
        const {offer} = res.locals;

        const comments = await commentsService.findAll(offer);

        return res.status(HttpCode.OK).json(comments);
      })
  );

  route.delete(
      `/:offerId/comments/:commentId`,
      offerExists(offersService),
      catchAsync(async (req, res, next) => {
        const {offer} = res.locals;
        const {commentId} = req.params;
        if (isNaN(Number(commentId))) {
          return next(
              new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
          );
        }

        await commentsService.delete(offer, commentId);

        return res.status(HttpCode.NO_CONTENT).json({});
      })
  );

  route.post(
      `/:offerId/comments`,
      [offerExists(offersService), schemaValidator(newCommentSchema)],
      catchAsync(async (req, res) => {
        const {offer} = res.locals;
        const newComment = await commentsService.create(offer, req.body);

        return res.status(HttpCode.OK).json(newComment);
      })
  );

  app.use(`/offers`, route);
};
