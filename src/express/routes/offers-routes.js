"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {
  catchAsync,
  formatDate,
  getPageList,
  getCardColor,
} = require(`../../utils`);
const {PAGINATION_OFFSET, UPLOAD_DIR} = require(`../../constants`);
const privateRoute = require(`../middleware/private-route`);
const checkAuthorization = require(`../middleware/check-authorization`);
const idValidator = require(`../../service/cli/server/middleware/id-validator`);

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  },
});
const upload = multer({storage});

const offersRouter = new Router();

offersRouter.get(
    `/category/:categoryId`,
    idValidator,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const page = Number(req.query.page) || 1;
      const {categoryId} = req.params;
      const {count, offers: listOffers} = await api.getOffersByCategory(
          page,
          categoryId
      );
      const categories = await api.getCategories();
      const category = await api.getCategory(categoryId);
      listOffers.forEach((offer) => {
        offer.cardColor = getCardColor();
      });
      const maxPage = Math.ceil(count / PAGINATION_OFFSET);
      const pageList = getPageList(page, maxPage);
      return res.render(`category`, {
        page,
        maxPage,
        pageList,
        listOffers,
        category,
        count,
        categories,
        user,
      });
    })
);

offersRouter.get(
    `/add`,
    privateRoute,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const categories = await api.getCategories();
      res.render(`new-ticket`, {
        categories,
        user,
      });
    })
);

offersRouter.get(
    `/edit/:offerId`,
    [privateRoute, checkAuthorization, idValidator, upload.single(`picture`)],
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {offerId} = req.params;
      const [offer, categories] = await Promise.all([
        api.getOffer(offerId),
        api.getCategories(),
      ]);
      res.render(`ticket-edit`, {offer, categories, user});
    })
);

offersRouter.post(
    `/edit/:offerId`,
    [idValidator, upload.single(`picture`)],
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {offerId} = req.params;
      const {body, file} = req;
      const offerData = {
        title: body.title,
        description: body.description,
        typeId: body.typeId,
        cost: body.cost,
        categories: body.categories,
      };
      if (typeof offerData.categories === `string`) {
        offerData.categories = [offerData.categories];
      }
      if (body.loadedPicture) {
        offerData.picture = body.loadedPicture;
      }
      if (file) {
        offerData.picture = file.filename;
      }
      try {
        await api.updateOffer(offerId, offerData, user.email);
        res.redirect(`/offers/${offerId}`);
      } catch (error) {
        const {details: errorDetails} = error.response.data.error;
        const [offer, categories] = await Promise.all([
          api.getOffer(offerId),
          api.getCategories(),
        ]);
        res.render(`ticket-edit`, {
          offer: {
            ...offer,
            ...offerData,
            picture: offerData.picture || offer.picture,
            loadedPicture: file ? file.filename : null,
          },
          categories,
          errorDetails,
          user,
        });
      }
    })
);

offersRouter.get(
    `/:offerId`,
    idValidator,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {offerId} = req.params;
      const itemOffer = await api.getOffer(offerId);
      res.render(`ticket`, {itemOffer, formatDate, user});
    })
);

offersRouter.post(
    `/:offerId/comments`,
    idValidator,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {offerId} = req.params;
      const {body} = req;
      const commentData = {
        userId: user.id,
        text: body.text,
      };
      try {
        await api.createComment(offerId, commentData);
        res.redirect(`/offers/${offerId}`);
      } catch (error) {
        const {details: errorDetails} = error.response.data.error;
        const itemOffer = await api.getOffer(offerId);
        res.render(`ticket`, {
          itemOffer,
          formatDate,
          prevCommentData: {text: commentData.text},
          errorDetails,
          user,
        });
      }
    })
);

offersRouter.get(
    `/:offerId/delete-comment/:commentId`,
    [idValidator, privateRoute, checkAuthorization],
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {offerId, commentId} = req.params;
      await api.deleteComment(offerId, commentId, user.email);
      res.status(204).send();
    })
);

offersRouter.post(
    `/add`,
    upload.single(`picture`),
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {body, file} = req;
      const offerData = {
        title: body.title,
        description: body.description,
        typeId: body.typeId,
        cost: body.cost,
        picture: file ? file.filename : `blank.png`,
        categories: body.categories,
        userId: user.id,
      };
      if (typeof offerData.categories === `string`) {
        offerData.categories = [offerData.categories];
      }
      try {
        await api.createOffer(offerData);
        res.redirect(`/my`);
      } catch (error) {
        const {details} = error.response.data.error;
        const categories = await api.getCategories();
        res.render(`new-ticket`, {
          categories,
          prevOfferData: offerData,
          errorDetails: details,
          user,
        });
      }
    })
);

offersRouter.get(
    `/delete/:offerId`,
    [idValidator, privateRoute, checkAuthorization],
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {offerId} = req.params;
      await api.deleteOffer(offerId, user.email);
      res.status(204).send();
    })
);

module.exports = offersRouter;
