"use strict";

class CategoryService {
  constructor(db) {
    this._db = db;
  }

  async findAll() {
    return await this._db.Category.findAll();
  }

  async findOne(id) {
    return await this._db.Category.findByPk(id);
  }
}

module.exports = CategoryService;
