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
  ExitCode
} = require(`../constants`);
const chalk = require(`chalk`);
const config = require(`../config`);

const app = express();

app.use(express.static(path.resolve(__dirname, DirPath.PUBLIC)));
app.use(express.static(path.resolve(__dirname, DirPath.UPDATE)));
app.set(`views`, path.resolve(__dirname, DirPath.TEMPLATES));
app.set(`view engine`, `pug`);

app.use(`/`, mainRouter);
app.use(`/register`, registerRouter);
app.use(`/login`, loginRouter);
app.use(`/my`, myRouter);
app.use(`/offers`, offersRouter);
app.use(`/search`, searchRouter);

app.use((req, res) => res.status(HttpCode.NOT_FOUND).render(`errors/400`));
app.use((err, req, res) => {
  console.trace(err);
  return res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(config.FRONT_PORT, (err) => {
  if (err) {
    console.log(chalk.red(`Неудалось запустить сервер`));
    process.exit(ExitCode.ERROR);
  }

  console.log(chalk.gray(`Сервер запущен, порт: ${config.FRONT_PORT}`));
});
