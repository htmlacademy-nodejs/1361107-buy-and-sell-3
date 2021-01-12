"use strict";

const {PAGINATION_OFFSET} = require(`../../../../constants`);
const {getSequelizeQueryOptions} = require(`../../../../utils`);
const {Op, Sequelize} = require(`sequelize`);

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

  async findByCategory(page, categoryId) {
    const {count, rows} = await this._db.OfferCategories.findAndCountAll({
      where: {
        categoryId,
      },
      attributes: [`offerId`],
      limit: PAGINATION_OFFSET,
      offset: PAGINATION_OFFSET * (page - 1),
    });

    const idList = rows.map((el) => el.offerId);

    const offers = await this._db.Offer.findAll({
      ...getSequelizeQueryOptions(`Offer`, this._db),
      where: {
        id: idList,
      },
    });

    return {count, offers};
  }

  async findUserOffers(page, userEmail) {
    const result = await this._db.User.findOne({
      ...getSequelizeQueryOptions(`User`, this._db),
      where: {
        email: userEmail
      },
      attributes: []
    });

    if (!result) {
      return null;
    }

    const offerIdList = result.offers.map((offer) => offer.id);

    return await this._db.Offer.findAndCountAll({
      ...getSequelizeQueryOptions(`Offer`, this._db),
      where: {
        id: offerIdList
      },
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

  async getDiscussed() {
    const result = await this._db.Comment.findAll({
      group: [`offerId`],
      attributes: [`offerId`, [Sequelize.fn(`count`, Sequelize.col(`offerId`)), `count`]],
      where: {
        offerId: {
          [Op.not]: null,
        }
      },
      order: [[`count`, `DESC`]],
      limit: 8,
    });

    const offerIdList = result.map((offer) => offer.offerId);

    const offers = await this._db.Offer.findAll({
      ...getSequelizeQueryOptions(`Offer`, this._db),
      where: {
        id: offerIdList
      },
    });

    const sortedOffers = offerIdList.map((id) => {
      const offerIndex = offers.findIndex((offer) => offer.id === id);
      return offers[offerIndex];
    });

    return sortedOffers;
  }
}

module.exports = OffersService;
