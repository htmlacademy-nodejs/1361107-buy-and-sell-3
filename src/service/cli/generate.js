"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  MAX_ADS_NUMBER,
  ExitCode,
  AdType,
  MAX_DESCR_SIZE,
  SumRestrict,
  PictureRestrict,
  MOCKS_FILE_NAME,
  DEFAULT_AD_AMOUNT,
} = require(`../../constants`);
const titles = require(`../../../data/titles.json`);
const categories = require(`../../../data/categories.json`);
const descriptions = require(`../../../data/descriptions.json`);
const {getRandomInt, shuffle} = require(`../../utils`);

const getPictureFileName = () => {
  let number = getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX);

  number = number < 10 ? `0${number}` : number;

  return `item${number}.jpg`;
};

const generateAd = (amount) => {
  return Array(amount)
    .fill(0, 0, amount)
    .map(() => {
      return {
        type:
          AdType[
            Object.keys(AdType)[getRandomInt(0, Object.keys(AdType).length - 1)]
          ],
        title: titles[getRandomInt(0, titles.length - 1)],
        description: shuffle(descriptions)
          .slice(0, getRandomInt(1, MAX_DESCR_SIZE))
          .join(` `),
        sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
        picture: getPictureFileName(),
        category: shuffle(categories).slice(
            0,
            getRandomInt(1, categories.length)
        ),
      };
    });
};

module.exports = {
  name: `--generate`,
  run: async (args) => {
    let count = Number.parseInt(args[0], 10);

    if (count > MAX_ADS_NUMBER) {
      console.log(`Не больше 1000 объявлений`);
      process.exit(ExitCode.SUCCESS);
    }

    count = !count || count <= 0 ? DEFAULT_AD_AMOUNT : count;

    const data = JSON.stringify(generateAd(count));

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
