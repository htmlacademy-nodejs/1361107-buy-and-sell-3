'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Comment extends Model {}
  Comment.init({
    text: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
  });

  return Comment;
};
