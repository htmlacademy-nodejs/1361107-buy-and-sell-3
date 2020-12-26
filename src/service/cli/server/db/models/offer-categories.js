"use strict";

const {Model} = require(`sequelize`);

module.exports = (sequelize) => {
  class OfferCategories extends Model {}
  OfferCategories.init(
      {},
      {
        sequelize,
        indexes: [{
          using: `BTREE`,
          fields: [`categoryId`]
        }, {
          using: `BTREE`,
          fields: [`offerId`]
        }],
        timestamps: false,
        paranoid: false,
        tableName: `Offer_Categories`,
      }
  );

  return OfferCategories;
};
