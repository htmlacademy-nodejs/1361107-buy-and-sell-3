"use strict";

class UsersService {
  constructor(db) {
    this._db = db;
  }

  async create(userData) {
    const newUser = await this._db.User.create(userData);

    return newUser;
  }
}

module.exports = UsersService;
