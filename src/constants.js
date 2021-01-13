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
  DATA_NOT_FOUND: `Data not found.`,
  API_ROUTE_NOT_FOUND: `Route not found.`,
  PAGE_NOT_FOUND: `Page not found.`,
  BAD_REQUEST: `Invalid data.`,
  FORBIDDEN: `This action is forbidden for you.`,
  SERVER_ERROR_MESSAGE: `Internal server error.`
};

exports.UserErrorMessage = {
  USER_NOT_EXISTS: `Пользователя не существует`,
  WRONG_DATA: `Неверный email или пароль`,
  FORBIDDEN: `У пользователя нет прав на данное действие`
};

exports.ServerMessage = {
  START_ERROR: `Failed to start server:`,
  START_SUCCESSFUL: `Server is running on port:`
};

exports.API_PREFIX = `/api`;

exports.MAX_ID_LENGTH = 6;

exports.PAGINATION_OFFSET = 8;

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

exports.DBErrorName = {
  FOREIGN_KEY_ERROR: `SequelizeForeignKeyConstraintError`,
  DATABASE_ERROR: `SequelizeDatabaseError`,
  VALIDATION_ERROR: `SequelizeValidationError`
};

exports.NewOfferMessage = {
  MIN_TITLE_LENGTH: `Заголовок должен быть не меньше 10 символов`,
  MAX_TITLE_LENGTH: `Заголовок должен быть не больше 100 символов`,
  MIN_DESCRIPTION_LENGTH: `Описание должно быть не меньше 50 символов`,
  MAX_DESCRIPTION_LENGTH: `Описание должно быть не больше 1000 символов`,
  MIN_COST_NUMBER: `Стоимость должна быть не меньше 100`,
  REQUIRED_FIELD: `Поле {#label} обязательно для заполнения`,
  WRONG_TYPE_ID: `Неверный id типа объявления`,
  WRONG_CATEGORY: `Категория должна быть типа число`,
  MIN_CATEGORY_ARRAY_LENGTH: `Необходимо указать хотя бы одну категорию`
};

exports.NewCommentMessage = {
  MIN_TEXT_LENGTH: `Текст комментария должен быть не меньше 20 символов`,
  MAX_TEXT_LENGTH: `Текст комментария должен быть не больше 200 символов`,
  REQUIRED_FIELD: `Поле {#label} обязательно для заполнения`,
};

exports.NewUserMessage = {
  MAX_FIRST_NAME_LENGTH: `Имя должно быть не больше 30 символов`,
  MAX_LAST_NAME_LENGTH: `Фамилия должна быть не больше 30 символов`,
  MIN_PASSWORD_LENGTH: `Пароль должен быть не меньше 6 символов`,
  PASSWORDS_NOT_EQUALS: `Пароли не совпадают`,
  WRONG_EMAIL: `Введите валидный email`,
  REQUIRED_FIELD: `Поле {#label} обязательно для заполнения`,
  UNIQUE_EMAIL: `Пользователь с таким email уже существует`
};

exports.SALT_ROUNDS = 10;

exports.UPLOAD_DIR = `../upload/img/`;


