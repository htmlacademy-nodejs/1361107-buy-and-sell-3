"use strict";

const bcrypt = require(`bcrypt`);
const {SALT_ROUNDS} = require(`../../../../constants`);
const {getSequelizeQueryOptions} = require(`../../../../utils`);

class UsersService {
  constructor(db) {
    this._db = db;
  }

  async create(userData) {
    const hash = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const newUser = await this._db.User.create({...userData, password: hash});

    return newUser;
  }

  async findOne(id) {
    return await this._db.User.findByPk(
        id,
        getSequelizeQueryOptions(`User`, this._db)
    );
  }

  async findByEmail(email) {
    return await this._db.User.findOne({
      ...getSequelizeQueryOptions(`User`, this._db),
      attributes: [
        `id`,
        `firstName`,
        `lastName`,
        `email`,
        `password`,
        `avatar`,
      ],
      where: {email},
    });
  }
}

module.exports = UsersService;
