"use strict";

const path = require(`path`);
const express = require(`express`);
const mainRouter = require(`./routes/main-routes`);
const registerRouter = require(`./routes/register-routes`);
const loginRouter = require(`./routes/login-routes`);
const myRouter = require(`./routes/my-routes`);
const offersRouter = require(`./routes/offers-routes`);
const searchRouter = require(`./routes/search-routes`);
const {
  HttpCode,
  DirPath,
  ExitCode,
  ResponseMessage,
} = require(`../constants`);
const chalk = require(`chalk`);
const config = require(`../config`);
const {sequelize} = require(`../service/cli/server/db/db`);
const session = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 1800000,
  checkExpirationInterval: 60000,
});

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  saveUninitialized: false,
  name: `session_id`,
}));

(async () => {
  await sequelize.sync({force: false});
})();

app.use(express.static(path.resolve(__dirname, DirPath.PUBLIC)));
app.use(express.static(path.resolve(__dirname, DirPath.UPDATE)));
app.use(express.urlencoded({extended: false}));
app.set(`views`, path.resolve(__dirname, DirPath.TEMPLATES));
app.set(`view engine`, `pug`);

app.use(`/`, mainRouter);
app.use(`/register`, registerRouter);
app.use(`/login`, loginRouter);
app.use(`/my`, myRouter);
app.use(`/offers`, offersRouter);
app.use(`/search`, searchRouter);

app.use((req, res) =>
  res.status(HttpCode.NOT_FOUND).render(`errors/400`, {
    statusCode: HttpCode.NOT_FOUND,
    message: ResponseMessage.PAGE_NOT_FOUND,
  })
);
app.use((err, req, res, _next) => {
  console.log(err);
  const statusCode = err.response
    ? err.response.status
    : HttpCode.INTERNAL_SERVER_ERROR;
  if (statusCode < 500) {
    return res
      .status(err.response.status)
      .render(`errors/400`, {statusCode, message: err.response.data.message});
  }
  return res.status(statusCode).render(`errors/500`);
});

app.listen(config.FRONT_PORT, (err) => {
  if (err) {
    console.log(chalk.red(`Неудалось запустить сервер`));
    process.exit(ExitCode.ERROR);
  }

  console.log(chalk.gray(`Сервер запущен, порт: ${config.FRONT_PORT}`));
});
