"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {
  MAX_ADS_NUMBER,
  ExitCode,
  AdType,
  MAX_DESCR_SIZE,
  SumRestrict,
  PictureRestrict,
  MOCKS_FILE_NAME,
  DEFAULT_AD_AMOUNT,
  DataFileName,
  MAX_ID_LENGTH,
  CommentRestrict,
} = require(`../../constants`);
const {getRandomInt, shuffle, readContent} = require(`../../utils`);

const getPictureFileName = () => {
  let number = getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX);

  number = number < 10 ? `0${number}` : number;

  return `item${number}.jpg`;
};

const generateCommentList = (commentsAmount, comments) => {
  return Array(commentsAmount)
    .fill({}, 0, commentsAmount)
    .map(() => {
      return {
        id: nanoid(MAX_ID_LENGTH),
        text: shuffle(comments)
          .slice(0, getRandomInt(1, CommentRestrict.MAX_SENTENCES_AMOUNT))
          .join(` `),
      };
    });
};

const generateAd = (amount, data) => {
  return Array(amount)
    .fill(0, 0, amount)
    .map(() => {
      return {
        id: nanoid(MAX_ID_LENGTH),
        type:
          AdType[
            Object.keys(AdType)[getRandomInt(0, Object.keys(AdType).length - 1)]
          ],
        title: data.titles[getRandomInt(0, data.titles.length - 1)],
        description: shuffle(data.sentences)
          .slice(0, getRandomInt(1, MAX_DESCR_SIZE))
          .join(` `),
        sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
        picture: getPictureFileName(),
        category: shuffle(data.categories).slice(
            0,
            getRandomInt(1, data.categories.length)
        ),
        comments: generateCommentList(
            getRandomInt(1, CommentRestrict.MAX_COMMENTS_AMOUNT),
            data.comments
        ),
      };
    });
};

module.exports = {
  name: `--generate`,
  run: async (args) => {
    let count = Number.parseInt(args[0], 10);

    const [titles, categories, sentences, comments] = await Promise.all(
        Object.values(DataFileName).map((fileName) => readContent(fileName))
    );

    if (count > MAX_ADS_NUMBER) {
      console.log(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.SUCCESS);
    }

    count = !count || count <= 0 ? DEFAULT_AD_AMOUNT : count;

    const data = JSON.stringify(
        generateAd(count, {titles, categories, sentences, comments})
    );

    try {
      await fs.writeFile(MOCKS_FILE_NAME, data);
      console.log(chalk.green(`Файл успешно создан`));
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      console.log(chalk.red(`Неудалось записать файл`));
      process.exit(ExitCode.ERROR);
    }
  },
};
