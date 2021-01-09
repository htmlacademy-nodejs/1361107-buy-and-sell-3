"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const offerExists = require(`../middleware/offer-exists`);
const {catchAsync} = require(`../../../../utils`);
const schemaValidator = require(`../middleware/schema-validator`);
const newOfferSchema = require(`../schemas/new-offer`);
const newCommentSchema = require(`../schemas/new-comment`);
const updateOfferSchema = require(`../schemas/update-offer`);
const idValidator = require(`../middleware/id-validator`);
const isCategoryExists = require(`../middleware/is-category-exists`);
const isUserExists = require(`../middleware/is-user-exists`);
const checkAuthorization = require(`../middleware/check-authorization`);

module.exports = (app, services) => {
  const {
    offersService,
    commentsService,
    categoryService,
    usersService,
  } = services;

  const route = new Router();

  route.get(
      `/`,
      catchAsync(async (req, res) => {
        const page = Number(req.query.page) || 1;
        const result = await offersService.findAll(page);

        return res.status(HttpCode.OK).json(result);
      })
  );

  route.get(
      `/my`,
      catchAsync(async (req, res) => {
        const page = Number(req.query.page) || 1;
        const {userEmail} = req.query;
        const result = await offersService.findUserOffers(page, userEmail);

        return res.status(HttpCode.OK).json(result);
      })
  );

  route.get(
      `/category/:categoryId`,
      [idValidator, isCategoryExists(categoryService)],
      catchAsync(async (req, res) => {
        const {categoryId} = req.params;
        const page = Number(req.query.page) || 1;
        const result = await offersService.findByCategory(page, categoryId);

        return res.status(HttpCode.OK).json(result);
      })
  );

  route.get(
      `/:offerId`,
      [idValidator, offerExists(offersService)],
      (req, res) => {
        const {offer} = res.locals;

        return res.status(HttpCode.OK).json(offer);
      }
  );

  route.post(
      `/`,
      schemaValidator(newOfferSchema),
      isUserExists(usersService),
      catchAsync(async (req, res) => {
        const newOffer = await offersService.create(req.body);

        return res.status(HttpCode.CREATED).json(newOffer);
      })
  );

  route.put(
      `/:offerId`,
      [
        idValidator,
        schemaValidator(updateOfferSchema),
        offerExists(offersService),
        checkAuthorization(offersService),
      ],
      catchAsync(async (req, res) => {
        const {offerId} = req.params;

        const updatedOffer = await offersService.update(offerId, req.body);

        return res.status(HttpCode.OK).json(updatedOffer);
      })
  );

  route.delete(
      `/:offerId`,
      [idValidator, checkAuthorization(offersService)],
      catchAsync(async (req, res) => {
        const {offerId} = req.params;

        await offersService.delete(offerId);
        return res.status(HttpCode.NO_CONTENT).json({});
      })
  );

  route.get(
      `/:offerId/comments`,
      [idValidator, offerExists(offersService)],
      catchAsync(async (req, res) => {
        const {offer} = res.locals;

        const comments = await commentsService.findAll(offer);

        return res.status(HttpCode.OK).json(comments);
      })
  );

  route.delete(
      `/:offerId/comments/:commentId`,
      [idValidator, offerExists(offersService), checkAuthorization(offersService)],
      catchAsync(async (req, res) => {
        const {offer} = res.locals;
        const {commentId} = req.params;

        await commentsService.delete(offer, commentId);

        return res.status(HttpCode.NO_CONTENT).json({});
      })
  );

  route.post(
      `/:offerId/comments`,
      [
        idValidator,
        offerExists(offersService),
        schemaValidator(newCommentSchema),
        isUserExists(usersService),
      ],
      catchAsync(async (req, res) => {
        const {offer} = res.locals;
        const newComment = await commentsService.create(offer, req.body);

        return res.status(HttpCode.OK).json(newComment);
      })
  );

  app.use(`/offers`, route);
};
