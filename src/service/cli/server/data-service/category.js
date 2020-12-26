"use strict";

const Sequelize = require(`sequelize`);

class CategoryService {
  constructor(db) {
    this._db = db;
  }

  async findAll() {
    return await this._db.Category.findAll({
      include: {
        model: this._db.OfferCategories,
        attributes: []
      },
      attributes: [`id`, `name`, [Sequelize.fn(`count`, Sequelize.col(`categoryId`)), `offerCount`]],
      group: [`Category.id`, `OfferCategories.categoryId`]
    });
  }

  async findOne(id) {
    return await this._db.Category.findByPk(id);
  }
}

module.exports = CategoryService;
