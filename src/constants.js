"use strict";

exports.DEFAULT_COMMAND = `--help`;

exports.USER_ARGV_INDEX = 2;

exports.ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

exports.DataFileName = {
  titles: `data/titles.txt`,
  categories: `data/categories.txt`,
  sentences: `data/sentences.txt`,
  comments: `data/comments.txt`,
  firstNames: `data/firstnames.txt`,
  lastNames: `data/lastnames.txt`
};

exports.MAX_OFFERS_NUMBER = 1000;

exports.NOT_FOUND_MESSAGE = `Ничего не найдено`;
exports.SERVER_ERROR_MESSAGE = `Ошибка на стороне сервера`;

exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

exports.OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

exports.MAX_DESCR_SIZE = 5;

exports.SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

exports.PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

exports.MOCKS_FILE_NAME = `mocks.json`;

exports.FILL_DB_FILE_NAME = `fill-db.sql`;

exports.DEFAULT_OFFER_AMOUNT = 1;

exports.ResponseMessage = {
  DATA_NOT_FOUND: `Данные не найдены`,
  API_ROUTE_NOT_FOUND: `Маршрут не найден`,
  PAGE_NOT_FOUND: `Страница не найдена`,
  BAD_REQUEST: `Получены неверные данные`,
};

exports.API_PREFIX = `/api`;

exports.MAX_ID_LENGTH = 6;

exports.CommentRestrict = {
  MAX_SENTENCES_AMOUNT: 3,
  MAX_COMMENTS_AMOUNT: 5,
};

exports.HELP_MESSAGE = `
Программа запускает http-сервер и формирует файл с данными для API.

  Гайд:
  service.js <command>

  Команды:
  --version:            выводит номер версии
  --help:               печатает этот текст
  --generate <count>    формирует файл mocks.json
  --server <port>       запускает веб-сервер на указаном порте
  --fill <count>        создает sql-файл c запросами для заполнения базы данных
`;

exports.DirPath = {
  PUBLIC: `public`,
  TEMPLATES: `templates`,
  UPDATE: `upload`,
};

exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

exports.getSequelizeQueryOptions = (model, db) => {
  const options = {
    Offer: {
      attributes: {exclude: [`userId`, `typeId`]},
      include: [
        {
          model: db.User,
          as: `owner`,
          attributes: [`id`, `firstName`, `lastName`, `email`],
        },
        {model: db.OfferType, as: `offerType`},
        {
          model: db.Comment,
          as: `comments`,
          attributes: {exclude: [`userId`, `offerId`]},
          include: {
            model: db.User,
            as: `user`,
            attributes: [`id`, `firstName`, `lastName`, `email`],
          },
        },
        {
          model: db.Category,
          as: `categories`,
          through: {
            attributes: [],
          },
        },
      ],
    }
  };

  return options[model];
};
