"use strict";

const bcrypt = require(`bcrypt`);
const {SALT_ROUNDS} = require(`../../../../constants`);

class UsersService {
  constructor(db) {
    this._db = db;
  }

  async create(userData) {
    const hash = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const newUser = await this._db.User.create({...userData, password: hash});

    return newUser;
  }

  async findByEmail(email) {
    return await this._db.User.findOne({where: {email}});
  }
}

module.exports = UsersService;
