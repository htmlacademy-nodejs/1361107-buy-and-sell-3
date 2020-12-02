"use strict";

const {db} = require(`../db/db`);
const {getSequelizeQueryOptions} = require(`../../../../constants`);

class OffersService {
  async findAll() {
    return await db.Offer.findAll(getSequelizeQueryOptions(`Offer`, db));
  }

  async findOne(id) {
    return await db.Offer.findByPk(id, getSequelizeQueryOptions(`Offer`, db));
  }

  async create(offerData) {
    const newOffer = await db.Offer.create(offerData);

    await newOffer.addCategories(offerData.category);

    return newOffer;
  }

  async update(id, offerData) {
    const result = await db.Offer.update(offerData, {
      where: {
        id,
      },
      returning: true,
    });

    if (offerData.category) {
      const offer = await db.Offer.findByPk(id);
      await offer.setCategories(offerData.category);
      return offer;
    }

    return result[1][0];
  }

  async delete(id) {
    await db.Offer.destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = OffersService;
