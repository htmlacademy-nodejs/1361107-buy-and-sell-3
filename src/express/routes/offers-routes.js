"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {buildQueryString, catchAsync} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;

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

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));

offersRouter.get(
    `/add`,
    catchAsync(async (req, res) => {
      const categories = await api.getCategories();
      res.render(`new-ticket`, {
        categories,
        prevOfferData: Object.keys(req.query).length === 0 ? null : req.query,
      });
    })
);

offersRouter.get(
    `/edit/:id`,
    catchAsync(async (req, res) => {
      const {id} = req.params;
      const [offer, categories] = await Promise.all([
        api.getOffer(id),
        api.getCategories(),
      ]);
      res.render(`ticket-edit`, {offer, categories});
    })
);

offersRouter.get(`/:id`, (req, res) => res.render(`ticket`));

offersRouter.post(
    `/add`,
    upload.single(`picture`),
    catchAsync(async (req, res) => {
      const {body, file} = req;
      const offerData = {
        title: body.title,
        description: body.description,
        typeId: body.typeId,
        cost: body.cost,
        picture: file ? file.filename : `item01.jpg`,
        category: body.category,
        userId: 1,
      };
      if (typeof offerData.category === `string`) {
        offerData.category = [offerData.category];
      }
      try {
        await api.createOffer(offerData);
        res.redirect(`/my`);
      } catch (error) {
        res.redirect(`/offers/add${buildQueryString(offerData)}`);
      }
    })
);

module.exports = offersRouter;
