"use strict";

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [array[i], array[randomPosition]] = [
      array[randomPosition],
      array[i],
    ];
  }

  return array;
};

exports.readContent = async (fileName) => {
  try {
    const list = await fs.readFile(`${fileName}`, `utf8`);
    const content = list
      .split(`\n`)
      .map((string) => string.replace(/(\r\n|\n|\r)/gm, ``));
    return content;
  } catch (error) {
    console.log(chalk.red(`Не удалось прочитать файл с данными`));
    return [];
  }
};
