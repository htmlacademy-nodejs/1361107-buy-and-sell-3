"use strict";

const {PAGINATION_OFFSET} = require(`../../../../constants`);
const {getSequelizeQueryOptions} = require(`../../../../utils`);

class OffersService {
  constructor(db) {
    this._db = db;
  }

  async findAll(page) {
    return await this._db.Offer.findAndCountAll({
      ...getSequelizeQueryOptions(`Offer`, this._db),
      distinct: true,
      limit: PAGINATION_OFFSET,
      offset: PAGINATION_OFFSET * (page - 1),
    });
  }

  async findOne(id) {
    return await this._db.Offer.findByPk(
        id,
        getSequelizeQueryOptions(`Offer`, this._db)
    );
  }

  async create(offerData) {
    const newOffer = await this._db.Offer.create(offerData);

    await newOffer.addCategories(offerData.categories);

    return newOffer;
  }

  async update(id, offerData) {
    const result = await this._db.Offer.update(offerData, {
      where: {
        id,
      },
      returning: true,
    });

    if (offerData.categories) {
      const offer = await this._db.Offer.findByPk(id);
      await offer.setCategories(offerData.categories);
      return offer;
    }

    return result[1][0];
  }

  async delete(id) {
    await this._db.Offer.destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = OffersService;
