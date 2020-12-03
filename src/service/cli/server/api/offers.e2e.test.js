"use strict";

const express = require(`express`);
const request = require(`supertest`);
const offers = require(`./offers`);
const DataService = require(`../data-service/offers`);
const CommentsService = require(`../data-service/comments`);
const {HttpCode} = require(`../../../../constants`);
const {mockDb, initAndFillMockDb, sequelize} = require(`../db/mock-db`);

const app = express();

app.use(express.json());
offers(app, new DataService(mockDb), new CommentsService(mockDb));

describe(`/offers route works correctly:`, () => {
  beforeAll(async () => {
    await initAndFillMockDb();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const mockNewOffer = {
    typeId: 1,
    userId: 1,
    title: `Куплю антиквариат.`,
    description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары.`,
    cost: 100000,
    picture: `item.jpg`,
    category: [1],
  };

  const mockNewComment = {text: `Новый комментарий!`, userId: 1};

  describe(`/offers GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    beforeEach(async () => {
      response = await request(app).get(`/offers`);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns list with correct length`, () =>
      expect(response.body.length).toBe(5));

    test(`returns list where second offer's id is correct`, () =>
      expect(response.body[1].id).toBe(2));
  });

  describe(`/offers/:offerId GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    beforeEach(async () => {
      response = await request(app).get(`/offers/1`);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns correct offer`, () => {
      expect(response.body.title).toBe(`Отдам в хорошие руки подшивку «Мурзилка».`);
      expect(response.body.description).toBe(
          `Если товар не понравится — верну всё до последней копейки.`
      );
    });
  });

  describe(`/offers POST request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
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
      await initAndFillMockDb();
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
      await initAndFillMockDb();
      response = await request(app).put(`/offers/1`).send(mockNewOffer);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`changes offer in the list`, async () => {
      const responceAfterChanges = await request(app).get(`/offers/1`);
      expect(responceAfterChanges.body.title).toBe(`Куплю антиквариат.`);
    });
  });

  describe(`/offers/:offerId wrong PUT request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 404 status code if offer id was not found`, async () => {
      response = await request(app)
        .put(`/offers/999`)
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
      await initAndFillMockDb();
      response = await request(app).delete(`/offers/1`);
    });

    test(`returns 204 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

    test(`deletes an offer`, async () => {
      const responceAfterChanges = await request(app).get(`/offers/1`);
      expect(responceAfterChanges.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`/offers/:offerId wrong DELETE request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).delete(`/offers/999`);
    });

    test(`returns 204 status code anyway`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));
  });

  describe(`/offers/:offerId/comments GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
      response = await request(app).get(`/offers/1/comments`);
    });

    test(`returns 200 status code`, async () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`returns comments list`, () => expect(response.body.length).toBe(2));
  });

  describe(`/offers/:offerId/comments POST request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
      response = await request(app)
        .post(`/offers/1/comments`)
        .send(mockNewComment);
    });

    test(`returns 200 status code`, async () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`creates a comment`, async () => {
      const responseAfterCreation = await request(app).get(
          `/offers/1/comments`
      );

      expect(responseAfterCreation.body[2].text).toBe(`Новый комментарий!`);
    });
  });

  describe(`/offers/:offerId/comments wrong POST request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 404 status code if an offer does not exist`, async () => {
      response = await request(app)
        .post(`/offers/999/comments`)
        .send(mockNewComment);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 400 status code if data is invalid`, async () => {
      response = await request(app).post(`/offers/1/comments`).send({
        message: `Новый комментарий!`,
      });
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`/offers/:offerId/comments/:commentId DELETE request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).delete(`/offers/1/comments/1`);
    });

    test(`returns 204 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

    test(`deletes a comment`, async () => {
      const responseAfterDeleting = await request(app).get(
          `/offers/1/comments`
      );
      expect(responseAfterDeleting.body.length).toBe(1);
    });
  });

  describe(`/offers/:offerId/comments/:commentId wrong DELETE request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 404 status code if an offer does not exist`, async () => {
      response = await request(app).delete(
          `/offers/999/comments/1`
      );
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 204 status code if a comment does not exist`, async () => {
      response = await request(app).delete(`/offers/1/comments/999`);
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });
  });
});
