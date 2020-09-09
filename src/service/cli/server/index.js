"use strict";

const chalk = require(`chalk`);
const express = require(`express`);
const {
  ExitCode,
  DEFAULT_API_PORT,
  HttpCode,
  NOT_FOUND_MESSAGE,
} = require(`../../../constants`);
const offersRouter = require(`./routes/offers-routes`);

const app = express();

app.use(express.json());
app.use(`/offers`, offersRouter);
app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(NOT_FOUND_MESSAGE));

module.exports = {
  name: `--server`,
  run(args) {
    const port = Number.parseInt(args[0], 10) || DEFAULT_API_PORT;

    app.listen(port, (err) => {
      if (err) {
        console.log(chalk.red(`Неудалось запустить сервер`));
        process.exit(ExitCode.ERROR);
      }

      console.log(chalk.gray(`Сервер запущен, порт: ${port}`));
    });
  },
};
