"use strict";

const {db} = require(`../db/db`);

class CategoryService {
  async findAll() {
    const categories = await db.Category.findAll();

    return categories;
  }
}

module.exports = CategoryService;
