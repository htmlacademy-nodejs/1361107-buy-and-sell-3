"use strict";

const Sequelize = require(`sequelize`);
const config = require(`../../../../config`);
const {getLogger} = require(`../../../lib/logger`);

const logger = getLogger({name: `database`});

const sequelize = new Sequelize(
    config.DB_NAME,
    config.DB_USER,
    config.DB_PASSWORD,
    {
      host: config.DB_HOST,
      dialect: `postgres`,
      logging: (msg) => logger.info(msg),
    }
);

const Category = require(`./models/category`)(sequelize);
const Comment = require(`./models/comment`)(sequelize);
const OfferType = require(`./models/offer-type`)(sequelize);
const Offer = require(`./models/offer`)(sequelize);
const User = require(`./models/user`)(sequelize);

User.hasMany(Offer, {
  foreignKey: `userId`,
  as: `offers`,
});
Offer.belongsTo(User, {
  foreignKey: `userId`,
  as: `owner`,
});

User.hasMany(Comment, {
  foreignKey: `userId`,
  as: `comments`,
});
Comment.belongsTo(User, {
  foreignKey: `userId`,
  as: `user`,
});

OfferType.hasMany(Offer, {
  foreignKey: `typeId`,
  as: `offers`,
});
Offer.belongsTo(OfferType, {
  foreignKey: `typeId`,
  as: `offerType`,
});

Offer.hasMany(Comment, {
  foreignKey: `offerId`,
  as: `comments`,
});
Comment.belongsTo(Offer, {
  foreignKey: `offerId`,
  as: `offer`,
});

Category.belongsToMany(Offer, {
  through: `Offer_Categories`,
  as: `offers`,
  timestamps: false,
  foreignKey: `categoryId`,
  otherKey: `offerId`,
});
Offer.belongsToMany(Category, {
  through: `Offer_Categories`,
  as: `categories`,
  timestamps: false,
  foreignKey: `offerId`,
  otherKey: `categoryId`,
});

const initDb = async () => {
  await sequelize.sync({force: true});
  logger.info(`Database created successfully.`);
};

module.exports = {
  db: {
    Category,
    User,
    Offer,
    Comment,
    OfferType,
  },
  sequelize,
  initDb,
};
