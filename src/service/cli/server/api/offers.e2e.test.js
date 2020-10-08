"use strict";

const express = require(`express`);
const request = require(`supertest`);
const offers = require(`./offers`);
const DataService = require(`../data-service/offers`);
const CommentsService = require(`../data-service/comments`);
const {HttpCode} = require(`../../../../constants`);

const mockData = [
  {
    id: `QWEfOZ`,
    type: `offer`,
    title: `Куплю антиквариат.`,
    description:
      `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары.`,
    sum: 89925,
    picture: `item06.jpg`,
    category: [`Посуда`, `Книги`, `Журналы`],
    comments: [
      {
        id: `HHVKWb`,
        text:
          `А где блок питания? Вы что?! В магазине дешевле. Неплохо, но дорого.`,
      },
      {id: `i53WSL`, text: `С чем связана продажа? Почему так дешёво?`},
      {
        id: `7Aj5M-`,
        text:
          `Почему в таком ужасном состоянии? Неплохо, но дорого. А где блок питания?`,
      },
      {id: `shDPgD`, text: `А где блок питания? А сколько игр в комплекте?`},
      {id: `Xzgx-d`, text: `Оплата наличными или перевод на карту?`},
    ],
  },
  {
    id: `oiiPJR`,
    type: `sale`,
    title: `Куплю породистого кота.`,
    description:
      `Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам.`,
    sum: 92383,
    picture: `item01.jpg`,
    category: [`Животные`, `Посуда`, `Игры`, `Книги`, `Разное`, `Журналы`],
    comments: [{id: `kamqLC`, text: `Почему в таком ужасном состоянии?`}],
  },
  {
    id: `-XSZCj`,
    type: `offer`,
    title: `Отдам в хорошие руки подшивку «Мурзилка».`,
    description:
      `Если товар не понравится — верну всё до последней копейки. Даю недельную гарантию. Кому нужен этот новый телефон, если тут такое... Товар в отличном состоянии. Пользовались бережно и только по большим праздникам.`,
    sum: 36214,
    picture: `item15.jpg`,
    category: [`Журналы`, `Разное`, `Посуда`, `Игры`],
    comments: [
      {
        id: `t2-1yz`,
        text: `А где блок питания? С чем связана продажа? Почему так дешёво?`,
      },
      {id: `OXE1gV`, text: `Неплохо, но дорого. Совсем немного...`},
      {id: `Z0f_ZD`, text: `А сколько игр в комплекте?`},
      {id: `7tOBlN`, text: `Продаю в связи с переездом. Отрываю от сердца.`},
      {id: `9QB2A6`, text: `Вы что?! В магазине дешевле.`},
    ],
  },
  {
    id: `67_BPX`,
    type: `sale`,
    title: `Куплю антиквариат.`,
    description: `Продаю с болью в сердце...`,
    sum: 32812,
    picture: `item16.jpg`,
    category: [`Разное`, `Книги`, `Животные`],
    comments: [
      {
        id: `-oIV6s`,
        text:
          `Оплата наличными или перевод на карту? Вы что?! В магазине дешевле. А где блок питания?`,
      },
    ],
  },
  {
    id: `ugFPOi`,
    type: `sale`,
    title: `Продам новую приставку Sony Playstation 5.`,
    description:
      `При покупке с меня бесплатная доставка в черте города. Если найдёте дешевле — сброшу цену.`,
    sum: 37026,
    picture: `item06.jpg`,
    category: [`Игры`, `Журналы`, `Разное`],
    comments: [
      {
        id: `-UsoYU`,
        text:
          `А сколько игр в комплекте? Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`,
      },
      {id: `t4_WZm`, text: `Совсем немного...`},
    ],
  },
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offers(app, new DataService(cloneData), new CommentsService());
  return app;
};

describe(`API returns a list of all offers`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`List length should be 5`, () => expect(response.body.length).toBe(5));

  test(`Second offer's id equals "oiiPJR"`, () => expect(response.body[1].id).toBe(`oiiPJR`));
});
