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

  const loginData = {
    email: `email0@mail.ru`,
    password: `password`,
  };

  describe(`/user/signup POST request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).post(`/user/signup`).send(mockNewUser);
    });

    test(`returns 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`creates new user`, () => {
      expect(response.body.firstName).toBe(`Петр`);
    });
  });

  describe(`/user/signup wrong POST request`, () => {
    beforeEach(async () => {
      await initAndFillMockDb();
    });

    test(`returns 400 status code if data is not correct`, async () => {
      for (const key of Object.keys(mockNewUser)) {
        const badUser = {...mockNewUser};
        delete badUser[key];
        const badResponse = await request(app)
          .post(`/user/signup`)
          .send(badUser);
        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`/user/login POST request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).post(`/user/login`).send(loginData);
    });

    test(`returns 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`returns correct user data`, () => {
      expect(response.body.email).toBe(loginData.email);
    });
  });

  describe(`/user/login wrong POST request`, () => {
    beforeEach(async () => {
      await initAndFillMockDb();
    });

    test(`returns 400 status code if data is not correct`, async () => {
      for (const key of Object.keys(loginData)) {
        const badLoginData = {...loginData};
        delete badLoginData[key];
        const badResponse = await request(app)
          .post(`/user/login`)
          .send(badLoginData);
        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });

    test(`returns 400 status code if user does not exists`, async () => {
      const response = await request(app)
        .post(`/user/login`)
        .send({...loginData, email: `wrongEmail@mail.ru`});
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 400 status code if password is incorrect`, async () => {
      const response = await request(app)
        .post(`/user/login`)
        .send({...loginData, password: `wrong-password`});
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});
