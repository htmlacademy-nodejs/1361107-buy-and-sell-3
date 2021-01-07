"use strict";

const express = require(`express`);
const request = require(`supertest`);
const {HttpCode} = require(`../../../../constants`);
const {mockDb, initAndFillMockDb, sequelize} = require(`../db/mock-db`);
const {UsersService} = require(`../data-service`);
const users = require(`./users`);

const app = express();

app.use(express.json());
users(app, new UsersService(mockDb));

describe(`/user route works correctly:`, () => {
  beforeAll(async () => {
    await initAndFillMockDb();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const mockNewUser = {
    firstName: `Петр`,
    lastName: `Петров`,
    password: `123456789`,
    repeatPassword: `123456789`,
    email: `email@mail.com`,
  };

  describe(`/user POST request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).post(`/user`).send(mockNewUser);
    });

    test(`returns 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`creates new user`, () => {
      expect(response.body.firstName).toBe(`Петр`);
    });
  });

  describe(`/user wrong POST request`, () => {

    beforeEach(async () => {
      await initAndFillMockDb();
    });

    test(`returns 400 status code if data is not correct`, async () => {
      for (const key of Object.keys(mockNewUser)) {
        const badUser = {...mockNewUser};
        delete badUser[key];
        const badResponse = await request(app).post(`/user`).send(badUser);
        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });
});
