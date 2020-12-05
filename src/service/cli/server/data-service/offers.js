"use strict";

const {getSequelizeQueryOptions} = require(`../../../../constants`);

class OffersService {
  constructor(db) {
    this._db = db;
  }

  async findAll() {
    return await this._db.Offer.findAll(getSequelizeQueryOptions(`Offer`, this._db));
  }

  async findOne(id) {
    return await this._db.Offer.findByPk(id, getSequelizeQueryOptions(`Offer`, this._db));
  }

  async create(offerData) {
    const newOffer = await this._db.Offer.create(offerData);

    await newOffer.addCategories(offerData.category);

    return newOffer;
  }

  async update(id, offerData) {
    const result = await this._db.Offer.update(offerData, {
      where: {
        id,
      },
      returning: true,
    });

    if (offerData.category) {
      const offer = await this._db.Offer.findByPk(id);
      await offer.setCategories(offerData.category);
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
