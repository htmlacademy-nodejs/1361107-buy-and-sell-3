"use strict";

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {UPLOAD_DIR, NewUserMessage} = require(`../../constants`);
const {nanoid} = require(`nanoid`);
const {catchAsync} = require(`../../utils`);
const alreadyRegistered = require(`../middleware/already-registered`);
const api = require(`../api`).getAPI();

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

const registerRouter = new Router();

registerRouter.get(`/`, alreadyRegistered, (req, res) => res.render(`sign-up`));

registerRouter.post(
    `/`,
    upload.single(`avatar`),
    catchAsync(async (req, res) => {
      const {body, file} = req;
      const userData = {...body};
      if (file) {
        userData.avatar = file.filename;
      }
      try {
        await api.createUser(userData);
        res.redirect(`/login`);
      } catch (error) {
        let {details: errorDetails} = error.response.data.error;
        if (!errorDetails) {
          errorDetails = [
            {message: NewUserMessage.UNIQUE_EMAIL, context: {key: `email`}},
          ];
        }
        res.render(`sign-up`, {
          prevUserData: {
            ...userData,
          },
          errorDetails,
        });
      }
    })
);

module.exports = registerRouter;
