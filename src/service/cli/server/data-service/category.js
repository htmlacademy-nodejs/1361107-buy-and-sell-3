"use strict";

class CategoryService {
  constructor(db) {
    this._db = db;
  }

  async findAll() {
    const categories = await this._db.Category.findAll();

    return categories;
  }
}

module.exports = CategoryService;
