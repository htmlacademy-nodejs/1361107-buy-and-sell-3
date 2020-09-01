"use strict";

const http = require(`http`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  ExitCode,
  DEFAULT_PORT,
  ROUTE,
  MOCKS_FILE_NAME,
  HttpCode,
  NOT_FOUND_MESSAGE,
} = require(`../../constants`);

const sendResponse = (res, statusCode, data) => {
  const content = `
    <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Куплю. Продам</title>
      </head>
      <body>
        ${data}
      </body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    "Content-Type": `text/html; charset=UTF-8`,
  });

  res.end(content);
};

const onClientRequest = async (req, res) => {
  switch (req.url) {
    case ROUTE.ROOT:
      try {
        const mocks = await fs.readFile(MOCKS_FILE_NAME);
        const ads = JSON.parse(mocks);
        const titleList = ads
          .map((ad) => {
            return `<li>${ad.title}</li>`;
          })
          .join(``);
        sendResponse(res, HttpCode.OK, `<ul>${titleList}</ul>`);
      } catch (error) {
        sendResponse(res, HttpCode.NOT_FOUND, NOT_FOUND_MESSAGE);
      }
      break;

    default:
      sendResponse(res, HttpCode.NOT_FOUND, NOT_FOUND_MESSAGE);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const port = Number.parseInt(args[0], 10) || DEFAULT_PORT;

    http
      .createServer(onClientRequest)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          console.log(chalk.red(`Неудалось запустить сервер`));
          process.exit(ExitCode.ERROR);
        }

        console.log(chalk.gray(`Сервер запущен, порт: ${port}`));
      });
  },
};
