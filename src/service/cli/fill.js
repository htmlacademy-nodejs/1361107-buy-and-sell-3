"use strict";

const {
  FILL_DB_FILE_NAME,
  MAX_ID_LENGTH,
  OfferType,
  CommentRestrict,
  SumRestrict,
  MAX_DESCR_SIZE,
} = require(`../../constants`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {
  ExitCode,
  MAX_OFFERS_NUMBER,
  DataFileName,
  DEFAULT_OFFER_AMOUNT,
} = require(`../../constants`);
const {readContent, getRandomInt, shuffle, getPictureFileName, getCreatedDate} = require(`../../utils`);
const {nanoid} = require(`nanoid`);

const generateInsertQuery = (tableName, values) => {
  return `INSERT INTO ${tableName} VALUES ${values};`;
};

const generateCategoriesQuery = (categoryList) => {
  const categories = categoryList.map((category) => `(DEFAULT, '${category}')`);

  return generateInsertQuery(`categories`, categories.join(`,`));
};

const generateUsersQuery = (usersCount, firstNames, lastNames) => {
  const users = Array(usersCount)
    .fill(0, 0, usersCount)
    .map(() => {
      const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
      const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
      const email = `${nanoid(MAX_ID_LENGTH)}@mail.ru`;
      return `(DEFAULT, '${firstName}', '${lastName}', '${email}', 'password')`;
    });

  return generateInsertQuery(`users`, users.join(`,`));
};

const generateOfferTypesQuery = () => {
  const types = Object.values(OfferType).map((type) => `(DEFAULT, '${type}')`);

  return generateInsertQuery(`offer_types`, types.join(`,`));
};

const generateCommentsQuery = (commentsCount, commentSentenceList) => {
  const generateCommentList = (commentsAmount, comments) => {
    return Array(commentsAmount)
      .fill({}, 0, commentsAmount)
      .map(() => {
        return shuffle(comments)
          .slice(0, getRandomInt(1, CommentRestrict.MAX_SENTENCES_AMOUNT))
          .join(` `);
      });
  };

  let currentOfferId = 1;
  let currentOfferCount = 0;

  const comments = generateCommentList(commentsCount, commentSentenceList).map(
      (comment) => {
        const userId = getRandomInt(1, commentsCount / 2);
        if (currentOfferCount === 2) {
          currentOfferCount = 0;
          currentOfferId++;
        }
        currentOfferCount++;
        return `(DEFAULT, '${comment}', ${userId}, ${currentOfferId})`;
      }
  );

  return generateInsertQuery(`comments`, comments.join(`,`));
};

const generateOffersQuery = (offersCount, titleList, sentencesList) => {
  const offers = Array(offersCount).fill({}, 0, offersCount).map(() => {
    const title = titleList[getRandomInt(0, titleList.length - 1)];
    const picture = getPictureFileName();
    const type = getRandomInt(1, Object.values(OfferType).length);
    const cost = getRandomInt(SumRestrict.MIN, SumRestrict.MAX);
    const description = shuffle(sentencesList)
    .slice(0, getRandomInt(1, MAX_DESCR_SIZE))
    .join(` `);
    const owner = getRandomInt(1, offersCount);
    const createdDate = getCreatedDate();

    return `(DEFAULT, '${title}', '${picture}', ${type}, ${cost}, '${description}', ${owner}, '${createdDate}')`;
  });

  return generateInsertQuery(`offers`, offers.join(`,`));
};

const generateOffersCategoriesQuery = (offersCount, categoryListLength) => {
  const values = [];

  for (let offerId = 1; offerId <= offersCount; offerId++) {
    const categoriesCount = getRandomInt(1, categoryListLength);

    const offerCategories = [];

    for (let j = 1; j <= categoriesCount; j++) {
      let categoryId = getRandomInt(1, categoryListLength);

      while (offerCategories.includes(categoryId)) {
        categoryId = getRandomInt(1, categoryListLength);
      }

      offerCategories.push(categoryId);
      values.push(`(${offerId}, ${categoryId})`);
    }
  }

  return generateInsertQuery(`offers_categories`, values.join(`, `));
};

const generateFile = (offersCount, dataList) => {
  const commentsCount = offersCount * 2;
  const usersCount = offersCount;

  const queryList = [];

  queryList.push(generateCategoriesQuery(dataList.categories));
  queryList.push(
      generateUsersQuery(usersCount, dataList.firstNames, dataList.lastNames)
  );
  queryList.push(generateOfferTypesQuery());
  queryList.push(generateOffersQuery(offersCount, dataList.titles, dataList.sentences));
  queryList.push(generateCommentsQuery(commentsCount, dataList.comments));
  queryList.push(generateOffersCategoriesQuery(offersCount, dataList.categories.length));

  return queryList.join(` `);
};

module.exports = {
  name: `--fill`,
  run: async (args) => {
    let count = Number.parseInt(args[0], 10);

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

    if (count > MAX_OFFERS_NUMBER) {
      console.log(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.SUCCESS);
    }

    count = !count || count <= 0 ? DEFAULT_OFFER_AMOUNT : count;

    const data = generateFile(count, {
      titles,
      categories,
      sentences,
      comments,
      firstNames,
      lastNames,
    });

    try {
      await fs.writeFile(FILL_DB_FILE_NAME, data);
      console.log(chalk.green(`Файл успешно создан`));
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      console.log(chalk.red(`Неудалось записать файл`));
      process.exit(ExitCode.ERROR);
    }
  },
};
