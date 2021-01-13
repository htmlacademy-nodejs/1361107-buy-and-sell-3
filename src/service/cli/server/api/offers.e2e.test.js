/* eslint-disable max-nested-callbacks */
"use strict";

const express = require(`express`);
const request = require(`supertest`);
const offers = require(`./offers`);
const {HttpCode} = require(`../../../../constants`);
const {mockDb, initAndFillMockDb, sequelize} = require(`../db/mock-db`);
const {
  OffersService,
  CategoryService,
  CommentsService,
  UsersService,
} = require(`../data-service`);

const app = express();

app.use(express.json());
offers(app, {
  offersService: new OffersService(mockDb),
  commentsService: new CommentsService(mockDb),
  categoryService: new CategoryService(mockDb),
  usersService: new UsersService(mockDb),
});

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
    categories: [1],
  };

  const updateOfferData = {
    description: `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары.`,
    cost: 100000,
    picture: `item.jpg`,
  };

  const mockNewComment = {
    text: `Новый комментарий, очень крутой комментарий!`,
    userId: 1,
  };

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
      expect(response.body.rows.length).toBe(5));
  });

  describe(`/offers/category/:categoryId GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    beforeEach(async () => {
      response = await request(app).get(`/offers/category/1`);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns list with correct length`, () =>
      expect(response.body.offers.length).toBe(5));

    test(`returns list where each offer has category with id equal 1`, () =>
      expect(
          response.body.offers.every((offer) =>
            offer.categories.map((category) => category.id).includes(1)
          )
      ).toBeTruthy());
  });

  describe(`/offers/category/:categoryId wrong GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    beforeEach(async () => {
      response = await request(app).get(`/offers/category/invalid-id`);
    });

    test(`returns 400 status code if id is invalid`, () =>
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
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
      expect(response.body.title).toBe(
          `Отдам в хорошие руки подшивку «Мурзилка».`
      );
      expect(response.body.description).toBe(
          `Если товар не понравится — верну всё до последней копейки.`
      );
    });
  });

  describe(`/offers/:offerId wrong GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    beforeEach(async () => {
      response = await request(app).get(`/offers/invalid-id`);
    });

    test(`returns 400 status code if id is invalid`, () =>
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
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
      expect(responseAfterIncrease.body.rows.length).toBe(6);
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

    test(`returns 400 status code if userId is not exists`, async () => {
      const response = await request(app)
        .post(`/offers`)
        .send({...mockNewOffer, userId: 3000});
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`/offers/:offerId PUT request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app)
        .put(`/offers/1?userEmail=email0@mail.ru`)
        .send(updateOfferData);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`changes offer in the list`, async () => {
      const responceAfterChanges = await request(app).get(`/offers/1`);
      expect(responceAfterChanges.body.description).toBe(
          `Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары.`
      );
    });
  });

  describe(`/offers/:offerId wrong PUT request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 404 status code if offer id was not found`, async () => {
      response = await request(app).put(`/offers/999`).send(updateOfferData);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 400 status code if offer id is invalid`, async () => {
      response = await request(app)
        .put(`/offers/invalid-id`)
        .send(updateOfferData);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 400 status code if data is invalid`, async () => {
      for (const key of Object.keys(updateOfferData)) {
        const badOffer = {...updateOfferData};
        delete badOffer[key];
        const badResponse = await request(app)
          .put(`/offers/QWEfOZ`)
          .send(badOffer);
        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });

    test(`returns 403 status code if email is wrong`, async () => {
      response = await request(app)
        .put(`/offers/1?userEmail=email3000@mail.ru`)
        .send(updateOfferData);
      expect(response.statusCode).toBe(HttpCode.FORBIDDEN);
    });
  });

  describe(`/offers/:offerId DELETE request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).delete(
          `/offers/1?userEmail=email0@mail.ru`
      );
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
    });

    test(`returns 204 status code anyway`, async () => {
      response = await request(app).delete(`/offers/999`);
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });

    test(`returns 404 status code if offer id is invalid`, async () => {
      response = await request(app).delete(`/offers/invalid-id`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 403 status code if email is wrong`, async () => {
      response = await request(app).delete(
          `/offers/1?userEmail=email3000@mail.ru`
      );
      expect(response.statusCode).toBe(HttpCode.FORBIDDEN);
    });
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

  describe(`/offers/:offerId/comments wrong GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 400 status code if offerId is invalid`, async () => {
      response = await request(app).get(`/offers/invalid-id/comments`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 404 status code if offerId is not exist`, async () => {
      response = await request(app).get(`/offers/999/comments`);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
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

      expect(responseAfterCreation.body[0].text).toBe(
          `Новый комментарий, очень крутой комментарий!`
      );
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

    test(`returns 400 status code if offerId is invalid`, async () => {
      response = await request(app).post(`/offers/invalid-id/comments`).send({
        message: `Новый комментарий!`,
      });
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`/offers/:offerId/comments/:commentId DELETE request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).delete(
          `/offers/1/comments/1?userEmail=email0@mail.ru`
      );
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
      response = await request(app).delete(`/offers/999/comments/1`);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 204 status code if a comment does not exist`, async () => {
      response = await request(app).delete(
          `/offers/1/comments/999?userEmail=email0@mail.ru`
      );
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });

    test(`returns 400 status code if offerId is invalid`, async () => {
      response = await request(app).delete(`/offers/invalid-id/comments/1`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 400 status code if commentId is invalid`, async () => {
      response = await request(app).delete(`/offers/1/comments/invalid-id`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 403 status code if email is wrong`, async () => {
      response = await request(app).delete(
          `/offers/1/comments/1?userEmail=email3000@mail.ru`
      );
      expect(response.statusCode).toBe(HttpCode.FORBIDDEN);
    });
  });
});
