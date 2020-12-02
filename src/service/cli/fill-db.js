"use strict";

const {nanoid} = require(`nanoid`);
const {
  ExitCode,
  MAX_OFFERS_NUMBER,
  DEFAULT_OFFER_AMOUNT,
  DataFileName,
  MAX_ID_LENGTH,
  OfferType,
  MAX_DESCR_SIZE,
  SumRestrict,
  CommentRestrict,
} = require(`../../constants`);
const {
  readContent,
  shuffle,
  getRandomInt,
  getPictureFileName,
} = require(`../../utils`);
const {getLogger} = require(`../lib/logger`);
const {db, sequelize} = require(`./server/db/db`);
const logger = getLogger({name: `database`});

module.exports = {
  name: `--fill-db`,
  run: async (args) => {
    let count = Number.parseInt(args[0], 10);

    if (count > MAX_OFFERS_NUMBER) {
      logger.error(`No more than 1000 ads`);
      process.exit(ExitCode.SUCCESS);
    }

    count = !count || count <= 0 ? DEFAULT_OFFER_AMOUNT : count;

    const [
      titles,
      categories,
      sentences,
      comments,
      firstNames,
      lastNames,
    ] = await Promise.all(
        Object.values(DataFileName).map((fileName) => readContent(fileName))
    );

    const categoryList = categories.map((category) => {
      return {
        name: category,
      };
    });

    const userList = Array(count)
      .fill({}, 0, count)
      .map(() => {
        return {
          firstName: shuffle(firstNames)[
            getRandomInt(0, firstNames.length - 1)
          ],
          lastName: shuffle(lastNames)[getRandomInt(0, firstNames.length - 1)],
          email: `${nanoid(MAX_ID_LENGTH)}@mail.ru`,
          password: `password`,
        };
      });

    const offerTypeList = Object.values(OfferType).map((type) => {
      return {
        name: type,
      };
    });

    const offerList = Array(count)
      .fill({}, 0, count)
      .map(() => {
        return {
          title: titles[getRandomInt(0, titles.length - 1)],
          picture: getPictureFileName(),
          description: shuffle(sentences)
            .slice(0, getRandomInt(1, MAX_DESCR_SIZE))
            .join(` `),
          cost: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
          userId: getRandomInt(1, count),
          typeId: getRandomInt(1, Object.values(OfferType).length),
        };
      });

    let currentOfferId = 1;
    let currentOfferCount = 0;
    const commentList = Array(count * 2)
      .fill({}, 0, count * 2)
      .map(() => {
        const userId = getRandomInt(1, count);
        if (currentOfferCount === 2) {
          currentOfferCount = 0;
          currentOfferId++;
        }
        currentOfferCount++;
        return {
          userId,
          offerId: currentOfferId,
          text: shuffle(comments)
            .slice(0, getRandomInt(1, CommentRestrict.MAX_SENTENCES_AMOUNT))
            .join(` `),
        };
      });

    try {
      await db.Category.bulkCreate(categoryList);
      await db.User.bulkCreate(userList);
      await db.OfferType.bulkCreate(offerTypeList);
      await db.Offer.bulkCreate(offerList);
      await db.Comment.bulkCreate(commentList);

      const dbOffersList = await db.Offer.findAll();
      await Promise.all(
          dbOffersList.map(async (offer) => {
            await offer.addCategories(
                shuffle([...categories])
              .slice(0, getRandomInt(1, MAX_DESCR_SIZE))
              .map(
                  (el) => categories.findIndex((category) => category === el) + 1
              )
            );
          })
      );
      logger.info(`Database successfully filled with data.`);
      sequelize.close();
      process.exit(ExitCode.SUCCESS);
    } catch (err) {
      logger.error(`Failed to fill database: ${err.message}`);
      sequelize.close();
      process.exit(ExitCode.ERROR);
    }
  },
};
