'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class OfferType extends Model {}
  OfferType.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: `Offer_Types`,
    timestamps: false,
    paranoid: false,
  });

  return OfferType;
};
