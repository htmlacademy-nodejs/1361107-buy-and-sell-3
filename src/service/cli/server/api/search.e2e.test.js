"use strict";

const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../../../constants`);

const mockData = [
  {
    id: `LAIyR_`,
    type: `sale`,
    title: `Куплю антиквариат.`,
    description: `Две страницы заляпаны свежим кофе. Товар в отличном состоянии. При покупке с меня бесплатная доставка в черте города.`,
    sum: 77543,
    picture: `item07.jpg`,
    category: [`Разное`, `Животные`],
    comments: [
      {id: `Fo9VT4`, text: `Оплата наличными или перевод на карту?`},
      {
        id: `VjDjyn`,
        text: `Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту? Неплохо, но дорого.`,
      },
      {
        id: `OP7-jD`,
        text: `Вы что?! В магазине дешевле. Совсем немного...`,
      },
      {
        id: `EdR4oj`,
        text: `Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту?`,
      },
    ],
  },
  {
    id: `aOoqWr`,
    type: `sale`,
    title: `Куплю породистого кота.`,
    description: `Даю недельную гарантию. Таких предложений больше нет!`,
    sum: 34203,
    picture: `item03.jpg`,
    category: [`Книги`, `Журналы`, `Животные`, `Разное`],
    comments: [
      {
        id: `pjOLVn`,
        text: `А где блок питания? Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`,
      },
    ],
  },
  {
    id: `y-DPDH`,
    type: `sale`,
    title: `Куплю детские санки.`,
    description: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе.`,
    sum: 33828,
    picture: `item08.jpg`,
    category: [`Животные`, `Игры`],
    comments: [
      {
        id: `PrFeKq`,
        text: `Почему в таком ужасном состоянии? А где блок питания?`,
      },
      {id: `bV-Qb_`, text: `Неплохо, но дорого.`},
      {
        id: `LxYksY`,
        text: `Совсем немного... А сколько игр в комплекте? Оплата наличными или перевод на карту?`,
      },
      {
        id: `EKfKTs`,
        text: `С чем связана продажа? Почему так дешёво? А где блок питания? Почему в таком ужасном состоянии?`,
      },
      {
        id: `U2W2yL`,
        text: `Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво?`,
      },
    ],
  },
  {
    id: `F4MpIg`,
    type: `sale`,
    title: `Куплю детские санки.`,
    description: `Не пытайтесь торговаться. Цену вещам я знаю. Таких предложений больше нет!`,
    sum: 77847,
    picture: `item06.jpg`,
    category: [`Журналы`, `Книги`],
    comments: [
      {
        id: `Yaw5PE`,
        text: `Продаю в связи с переездом. Отрываю от сердца.`,
      },
      {
        id: `d4Kpbs`,
        text: `А где блок питания? А сколько игр в комплекте?`,
      },
      {
        id: `-kMN8u`,
        text: `Оплата наличными или перевод на карту? Неплохо, но дорого. С чем связана продажа? Почему так дешёво?`,
      },
      {id: `Yl7O2f`, text: `Почему в таком ужасном состоянии?`},
    ],
  },
  {
    id: `usj9e_`,
    type: `offer`,
    title: `Продам коллекцию журналов «Огонёк».`,
    description: `Бонусом отдам все аксессуары.`,
    sum: 18459,
    picture: `item13.jpg`,
    category: [`Книги`, `Посуда`, `Игры`, `Животные`, `Разное`],
    comments: [
      {
        id: `XUjuCf`,
        text: `Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво? Совсем немного...`,
      },
      {id: `hDaI_g`, text: `А где блок питания?`},
    ],
  },
];

const app = express();

app.use(express.json());
search(app, new DataService(mockData));

describe(`/search route works correct:`, () => {
  describe(`/search?query= GET request`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app).get(`/search`).query({
        query: `Куплю детские санки`,
      });
    });

    test(`returns 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`founds correct amount of offers`, () => {
      expect(response.body.length).toBe(2);
    });

    test(`founds offers with correct id`, () => {
      expect(response.body[0].id).toBe(`y-DPDH`);
      expect(response.body[1].id).toBe(`F4MpIg`);
    });
  });

  describe(`/search?query= wrong GET request`, () => {
    test(`returns code 404 if nothing was found`, async () => {
      const response = await request(app).get(`/search`).query({
        query: `Куплю детские лыжи`,
      });
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 400 when query string is absent`, async () => {
      const response = await request(app).get(`/search`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

