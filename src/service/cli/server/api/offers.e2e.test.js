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

describe(`API returns a list of all offers`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`List length should be 5`, () => expect(response.body.length).toBe(5));

  test(`Second offer's id equals "oiiPJR"`, () =>
    expect(response.body[1].id).toBe(`oiiPJR`));
});

describe(`API returns an offer with specific id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/oiiPJR`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title should be "Куплю породистого кота."`, () =>
    expect(response.body.title).toBe(`Куплю породистого кота.`));

  test(`Offer's description should be "Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам."`, () =>
    expect(response.body.description).toBe(
        `Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам.`
    ));
});

describe(`API creates new offer if data is valid`, () => {
  const app = createAPI();

  let response;

  const mockOffer = {
    type: `offer`,
    title: `Куплю антиквариат.`,
    description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары.`,
    sum: 100000,
    picture: `item.jpg`,
    category: [`Посуда`, `Книги`, `Журналы`],
  };

  beforeAll(async () => {
    response = await request(app).post(`/offers`).send(mockOffer);
  });

  test(`Status code should be 201`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`List lenght should increase`, async () => {
    const responseAfterIncrease = await request(app).get(`/offers`);

    expect(responseAfterIncrease.body.length).toBe(6);
  });
});

describe(`API does not create new offer if data is not valid`, () => {
  const app = createAPI();

  const mockOffer = {
    type: `offer`,
    title: `Куплю антиквариат.`,
    description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары.`,
    sum: 100000,
    picture: `item.jpg`,
    category: [`Посуда`, `Книги`, `Журналы`],
  };

  test(`Without any required field status code should be 400`, async () => {
    for (const key of Object.keys(mockOffer)) {
      const badOffer = {...mockOffer};
      delete badOffer[key];
      const badResponse = await request(app).post(`/offers`).send(badOffer);
      expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API makes changes in an offer if data is valid`, () => {
  const app = createAPI();

  let response;

  const mockOffer = {
    type: `sale`,
    title: `Куплю непородистого кота.`,
    description: `Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам.`,
    sum: 92383,
    picture: `item01.jpg`,
    category: [`Животные`, `Посуда`, `Игры`, `Книги`, `Разное`, `Журналы`],
  };

  beforeAll(async () => {
    response = await request(app).put(`/offers/oiiPJR`).send(mockOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returned changed offer`, () => expect(response.body).toEqual(expect.objectContaining(mockOffer)));

  test(`Offer has changed in the list`, async () => {
    const responceAfterChanges = await request(app).get(`/offers/oiiPJR`);
    expect(responceAfterChanges.body.title).toBe(`Куплю непородистого кота.`);
  });
});

test(`API does not make any changes in non-existent offer`, async () => {
  const app = createAPI();

  const mockOffer = {
    type: `sale`,
    title: `Куплю непородистого кота.`,
    description: `Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам.`,
    sum: 92383,
    picture: `item01.jpg`,
    category: [`Животные`, `Посуда`, `Игры`, `Книги`, `Разное`, `Журналы`],
  };

  const response = await request(app).put(`/offers/non-existent-id`).send(mockOffer);

  expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
});

test(`API does not make any changes when data is not correct`, async () => {
  const app = createAPI();

  const mockOffer = {
    type: `sale`,
    title: `Куплю непородистого кота.`,
    description: `Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам.`,
    sum: 92383,
    picture: `item01.jpg`,
  };

  const response = await request(app).put(`/offers/oiiPJR`).send(mockOffer);

  expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
});

describe(`API deletes an offer`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/oiiPJR`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer has gone in the list`, async () => {
    const responceAfterChanges = await request(app).get(`/offers/oiiPJR`);
    expect(responceAfterChanges.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});

// describe(`API does nothing when trying to delete non-existent offer`, () => {
//   const app = createAPI();

//   let response;

//   beforeAll(async () => {
//     response = await request(app).delete(`/offers/non-existent-id`);
//   });

//   test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
// });

describe(`API returns comments list`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/QWEfOZ/comments`);
  });

  test(`Status code 200`, async () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Comments list length should be 5`, () => expect(response.body.length).toBe(5));
});

describe(`API creates new comment`, () => {
  const app = createAPI();

  let response;

  const mockComment = {text: `Новый комментарий!`};

  beforeAll(async () => {
    response = await request(app).post(`/offers/QWEfOZ/comments`).send(mockComment);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comment really exists`, async () => {
    const responseAfterCreation = await request(app).get(`/offers/QWEfOZ/comments`);

    expect(responseAfterCreation.body[5].text).toBe(`Новый комментарий!`);
  });
});

test(`API refuses to create a comment to non-existent offer`, async () => {

  const app = createAPI();

  const response = await request(app)
    .post(`/offers/non-existent-id/comments`)
    .send({
      text: `Новый комментарий!`
    });

  expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to an offer if data is not correct`, async () => {

  const app = createAPI();

  const response = await request(app)
    .post(`/offers/QWEfOZ/comments`)
    .send({
      message: `Новый комментарий!`
    });

  expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
});

describe(`API deletes comment`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/QWEfOZ/comments/HHVKWb`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comment really deleted`, async () => {
    const responseAfterDeleting = await request(app).get(`/offers/QWEfOZ/comments`);

    expect(responseAfterDeleting.body.length).toBe(5);
  });
});

test(`API refuses to delete a comment to non-existent offer`, async () => {

  const app = createAPI();

  const response = await request(app)
    .delete(`/offers/non-existent-id/comments`);

  expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a non-existent comment`, async () => {

  const app = createAPI();

  const response = await request(app)
    .delete(`/offers/QWEfOZ/comments/non-existent-id`);

  expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
});
