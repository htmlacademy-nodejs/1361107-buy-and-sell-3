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
    description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары.`,
    sum: 89925,
    picture: `item06.jpg`,
    category: [`Посуда`, `Книги`, `Журналы`],
    comments: [
      {
        id: `HHVKWb`,
        text: `А где блок питания? Вы что?! В магазине дешевле. Неплохо, но дорого.`,
      },
      {id: `i53WSL`, text: `С чем связана продажа? Почему так дешёво?`},
      {
        id: `7Aj5M-`,
        text: `Почему в таком ужасном состоянии? Неплохо, но дорого. А где блок питания?`,
      },
      {id: `shDPgD`, text: `А где блок питания? А сколько игр в комплекте?`},
      {id: `Xzgx-d`, text: `Оплата наличными или перевод на карту?`},
    ],
  },
  {
    id: `oiiPJR`,
    type: `sale`,
    title: `Куплю породистого кота.`,
    description: `Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам.`,
    sum: 92383,
    picture: `item01.jpg`,
    category: [`Животные`, `Посуда`, `Игры`, `Книги`, `Разное`, `Журналы`],
    comments: [{id: `kamqLC`, text: `Почему в таком ужасном состоянии?`}],
  },
  {
    id: `-XSZCj`,
    type: `offer`,
    title: `Отдам в хорошие руки подшивку «Мурзилка».`,
    description: `Если товар не понравится — верну всё до последней копейки. Даю недельную гарантию. Кому нужен этот новый телефон, если тут такое... Товар в отличном состоянии. Пользовались бережно и только по большим праздникам.`,
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
        text: `Оплата наличными или перевод на карту? Вы что?! В магазине дешевле. А где блок питания?`,
      },
    ],
  },
  {
    id: `ugFPOi`,
    type: `sale`,
    title: `Продам новую приставку Sony Playstation 5.`,
    description: `При покупке с меня бесплатная доставка в черте города. Если найдёте дешевле — сброшу цену.`,
    sum: 37026,
    picture: `item06.jpg`,
    category: [`Игры`, `Журналы`, `Разное`],
    comments: [
      {
        id: `-UsoYU`,
        text: `А сколько игр в комплекте? Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`,
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

describe(`/offers route works correctly:`, () => {
  const mockNewOffer = {
    type: `offer`,
    title: `Куплю антиквариат.`,
    description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары.`,
    sum: 100000,
    picture: `item.jpg`,
    category: [`Посуда`, `Книги`, `Журналы`],
  };

  const mockNewComment = {text: `Новый комментарий!`};

  let app;

  describe(`/offers GET request`, () => {
    let response;

    beforeAll(() => {
      app = createAPI();
    });

    beforeEach(async () => {
      response = await request(app).get(`/offers`);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns list with correct length`, () =>
      expect(response.body.length).toBe(5));

    test(`returns list where second offer's id is correct`, () =>
      expect(response.body[1].id).toBe(`oiiPJR`));
  });

  describe(`/offers/:offerId GET request`, () => {
    let response;

    beforeAll(() => {
      app = createAPI();
    });

    beforeEach(async () => {
      response = await request(app).get(`/offers/QWEfOZ`);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns correct offer`, () => {
      expect(response.body.title).toBe(`Куплю антиквариат.`);
      expect(response.body.description).toBe(
          `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары.`
      );
    });
  });

  describe(`/offers POST request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app).post(`/offers`).send(mockNewOffer);
    });

    test(`returns 201 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.CREATED));

    test(`creates new offer`, async () => {
      const responseAfterIncrease = await request(app).get(`/offers`);
      expect(responseAfterIncrease.body.length).toBe(6);
    });
  });

  describe(`/offers wrong POST request`, () => {
    beforeEach(async () => {
      app = createAPI();
    });

    test(`returns 400 status code if data is not correct`, async () => {
      for (const key of Object.keys(mockNewOffer)) {
        const badOffer = {...mockNewOffer};
        delete badOffer[key];
        const badResponse = await request(app).post(`/offers`).send(badOffer);
        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`/offers/:offerId PUT request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app).put(`/offers/QWEfOZ`).send(mockNewOffer);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns changed offer`, () =>
      expect(response.body).toEqual(expect.objectContaining(mockNewOffer)));

    test(`changes offer in the list`, async () => {
      const responceAfterChanges = await request(app).get(`/offers/QWEfOZ`);
      expect(responceAfterChanges.body.title).toBe(`Куплю антиквариат.`);
    });
  });

  describe(`/offers/:offerId wrong PUT request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
    });

    test(`returns 404 status code if offer id was not found`, async () => {
      response = await request(app)
        .put(`/offers/non-existent-id`)
        .send(mockNewOffer);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 400 status code if data is invalid`, async () => {
      for (const key of Object.keys(mockNewOffer)) {
        const badOffer = {...mockNewOffer};
        delete badOffer[key];
        const badResponse = await request(app)
          .put(`/offers/QWEfOZ`)
          .send(badOffer);
        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`/offers/:offerId DELETE request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app).delete(`/offers/QWEfOZ`);
    });

    test(`returns 204 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

    test(`deletes an offer`, async () => {
      const responceAfterChanges = await request(app).get(`/offers/QWEfOZ`);
      expect(responceAfterChanges.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`/offers/:offerId wrong DELETE request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app).delete(`/offers/non-existent-id`);
    });

    test(`returns 204 status code anyway`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));
  });

  describe(`/offers/:offerId/comments GET request`, () => {
    let response;

    beforeAll(async () => {
      app = createAPI();
      response = await request(app).get(`/offers/QWEfOZ/comments`);
    });

    test(`returns 200 status code`, async () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`returns comments list`, () => expect(response.body.length).toBe(5));
  });

  describe(`/offers/:offerId/comments POST request`, () => {
    let response;

    beforeAll(async () => {
      app = createAPI();
      response = await request(app)
        .post(`/offers/QWEfOZ/comments`)
        .send(mockNewComment);
    });

    test(`returns 200 status code`, async () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`creates a comment`, async () => {
      const responseAfterCreation = await request(app).get(
          `/offers/QWEfOZ/comments`
      );

      expect(responseAfterCreation.body[5].text).toBe(`Новый комментарий!`);
    });
  });

  describe(`/offers/:offerId/comments POST request`, () => {
    let response;

    beforeAll(async () => {
      app = createAPI();
      response = await request(app)
        .post(`/offers/QWEfOZ/comments`)
        .send(mockNewComment);
    });

    test(`returns 200 status code`, async () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`creates a comment`, async () => {
      const responseAfterCreation = await request(app).get(
          `/offers/QWEfOZ/comments`
      );

      expect(responseAfterCreation.body[5].text).toBe(`Новый комментарий!`);
    });
  });

  describe(`/offers/:offerId/comments wrong POST request`, () => {
    let response;

    beforeAll(async () => {
      app = createAPI();
    });

    test(`returns 404 status code if an offer does not exist`, async () => {
      response = await request(app)
        .post(`/offers/non-existent-id/comments`)
        .send(mockNewComment);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 400 status code if data is invalid`, async () => {
      response = await request(app).post(`/offers/QWEfOZ/comments`).send({
        message: `Новый комментарий!`,
      });
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`/offers/:offerId/comments/:commentId DELETE request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app).delete(`/offers/QWEfOZ/comments/HHVKWb`);
    });

    test(`returns 204 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

    test(`deletes a comment`, async () => {
      const responseAfterDeleting = await request(app).get(
          `/offers/QWEfOZ/comments`
      );
      expect(responseAfterDeleting.body.length).toBe(4);
    });
  });

  describe(`/offers/:offerId/comments/:commentId wrong DELETE request`, () => {
    let response;

    beforeAll(async () => {
      app = createAPI();
    });

    test(`returns 404 status code if an offer does not exist`, async () => {
      response = await request(app).delete(
          `/offers/non-existent-id/comments/HHVKWb`
      );
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 204 status code if a comment does not exist`, async () => {
      response = await request(app).delete(`/offers/QWEfOZ/comments/non-existent-id`);
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });
  });
});
