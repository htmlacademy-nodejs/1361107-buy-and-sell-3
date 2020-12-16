"use strict";

const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../../../constants`);
const {mockDb, initAndFillMockDb, sequelize} = require(`../db/mock-db`);

const app = express();

app.use(express.json());
search(app, new DataService(mockDb));

describe(`/search route works correct:`, () => {
  beforeAll(async () => {
    await initAndFillMockDb();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe(`/search?query= GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
      response = await request(app).get(`/search`).query({
        search: `Куплю антиквариат`,
      });
    });

    test(`returns 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`founds correct amount of offers`, () => {
      expect(response.body.offers.length).toBe(2);
    });

    test(`founds offers with correct id`, () => {
      expect(response.body.offers[0].id).toBe(2);
      expect(response.body.offers[1].id).toBe(3);
    });
  });

  describe(`/search?query= wrong GET request`, () => {
    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns code 404 if nothing was found`, async () => {
      const response = await request(app).get(`/search`).query({
        search: `Куплю детские лыжи`,
      });
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 400 when query string is absent`, async () => {
      const response = await request(app).get(`/search`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

