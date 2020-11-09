"use strict";

const express = require(`express`);
const request = require(`supertest`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../../../constants`);

const mockData = [
  {
    id: `dK3BT8`,
    type: `offer`,
    title: `Куплю антиквариат.`,
    description: `Продаю с болью в сердце...`,
    sum: 64111,
    picture: `item03.jpg`,
    category: [`Посуда`],
    comments: [
      {id: `kPHN8_`, text: `Почему в таком ужасном состоянии?`},
      {
        id: `QGGdbV`,
        text:
          `А где блок питания? Оплата наличными или перевод на карту? Почему в таком ужасном состоянии?`,
      },
      {
        id: `Dv44KQ`,
        text:
          `Оплата наличными или перевод на карту? А сколько игр в комплекте? С чем связана продажа? Почему так дешёво?`,
      },
      {
        id: `QWdMaX`,
        text:
          `С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле.`,
      },
      {id: `txzBTK`, text: `Неплохо, но дорого.`},
    ],
  },
  {
    id: `7mRnvy`,
    type: `offer`,
    title: `Куплю детские санки.`,
    description: `Кажется, что это хрупкая вещь. Даю недельную гарантию.`,
    sum: 23240,
    picture: `item15.jpg`,
    category: [`Игры`],
    comments: [
      {
        id: `_oKDFK`,
        text:
          `Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво? А сколько игр в комплекте?`,
      },
    ],
  },
  {
    id: `4cwqnE`,
    type: `offer`,
    title: `Отдам в хорошие руки подшивку «Мурзилка».`,
    description:
      `Кому нужен этот новый телефон, если тут такое... Бонусом отдам все аксессуары.`,
    sum: 12845,
    picture: `item03.jpg`,
    category: [`Разное`],
    comments: [
      {
        id: `rycPEC`,
        text:
          `С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?`,
      },
      {
        id: `Rx_0LC`,
        text:
          `Совсем немного... А сколько игр в комплекте? С чем связана продажа? Почему так дешёво?`,
      },
      {
        id: `pXSERv`,
        text:
          `Почему в таком ужасном состоянии? Совсем немного... Вы что?! В магазине дешевле.`,
      },
      {id: `UTu9yr`, text: `Вы что?! В магазине дешевле.`},
      {id: `5S5S2w`, text: `С чем связана продажа? Почему так дешёво?`},
    ],
  },
  {
    id: `eKd5ib`,
    type: `offer`,
    title: `Продам книги Стивена Кинга.`,
    description:
      `Бонусом отдам все аксессуары. Продаю с болью в сердце... Таких предложений больше нет! Мой дед не мог её сломать. Кажется, что это хрупкая вещь.`,
    sum: 42057,
    picture: `item16.jpg`,
    category: [`Игры`],
    comments: [
      {id: `Lydzmu`, text: `А где блок питания?`},
      {
        id: `omvAY2`,
        text:
          `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца. А где блок питания?`,
      },
      {id: `rr0_kX`, text: `С чем связана продажа? Почему так дешёво?`},
      {id: `x6DQHO`, text: `Оплата наличными или перевод на карту?`},
    ],
  },
  {
    id: `Y5cY7U`,
    type: `offer`,
    title: `Куплю детские санки.`,
    description:
      `Если товар не понравится — верну всё до последней копейки. Не пытайтесь торговаться. Цену вещам я знаю. Две страницы заляпаны свежим кофе. Продаю с болью в сердце...`,
    sum: 70604,
    picture: `item08.jpg`,
    category: [`Игры`],
    comments: [
      {
        id: `pgNt77`,
        text:
          `А где блок питания? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`,
      },
      {id: `rnqp1I`, text: `Почему в таком ужасном состоянии?`},
      {id: `T80DZT`, text: `Оплата наличными или перевод на карту?`},
    ],
  },
];

const app = express();

app.use(express.json());
category(app, new DataService(mockData));

describe(`/categories route works correctly:`, () => {
  describe(`/categories GET request`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app).get(`/categories`);
    });

    test(`returns 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`returns list with correct length`, () => {
      expect(response.body.length).toBe(3);
    });

    test(`returns correct list of categories`, () => {
      expect(response.body).toEqual(
          expect.arrayContaining([`Игры`, `Разное`, `Посуда`])
      );
    });
  });
});
