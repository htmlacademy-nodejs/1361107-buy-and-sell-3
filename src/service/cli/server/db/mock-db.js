"use strict";

const Sequelize = require(`sequelize`);
const config = require(`../../../../config`);

const sequelize = new Sequelize(
    config.DB_NAME_TEST,
    config.DB_USER,
    config.DB_PASSWORD,
    {
      host: config.DB_HOST,
      dialect: `postgres`,
      logging: false
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

const initAndFillMockDb = async () => {
  await sequelize.sync({force: true});

  const mockDBData = {
    "categoryList": [
      {"name": `Книги`},
      {"name": `Разное`},
    ],
    "userList": [
      {
        "firstName": `Николай`,
        "lastName": `Бурундуков`,
        "email": `Gy3Qbn@mail.ru`,
        "password": `password`
      },
      {
        "firstName": `Айдар`,
        "lastName": `Бурундуков`,
        "email": `RYWP3o@mail.ru`,
        "password": `password`
      },
      {
        "firstName": `Григорий`,
        "lastName": `Бурундуков`,
        "email": `LyCBu6@mail.ru`,
        "password": `password`
      },
      {
        "firstName": `Айдар`,
        "lastName": `Бурундуков`,
        "email": `Ko4MkZ@mail.ru`,
        "password": `password`
      },
      {
        "firstName": `Евгений`,
        "lastName": `Пивоваров`,
        "email": `7RmPIW@mail.ru`,
        "password": `password`
      }
    ],
    "offerTypeList": [{"name": `offer`}, {"name": `sale`}],
    "offerList": [
      {
        "title": `Отдам в хорошие руки подшивку «Мурзилка».`,
        "picture": `item13.jpg`,
        "description": `Если товар не понравится — верну всё до последней копейки.`,
        "cost": 66314,
        "userId": 3,
        "typeId": 2
      },
      {
        "title": `Куплю антиквариат.`,
        "picture": `item02.jpg`,
        "description": `Если найдёте дешевле — сброшу цену. Таких предложений больше нет! Пользовались бережно и только по большим праздникам.`,
        "cost": 59494,
        "userId": 2,
        "typeId": 1
      },
      {
        "title": `Куплю антиквариат.`,
        "picture": `item07.jpg`,
        "description": `Товар в отличном состоянии. Бонусом отдам все аксессуары. Продаю с болью в сердце...`,
        "cost": 45284,
        "userId": 2,
        "typeId": 1
      },
      {
        "title": `Куплю детские санки.`,
        "picture": `item07.jpg`,
        "description": `Пользовались бережно и только по большим праздникам. Таких предложений больше нет! Даю недельную гарантию. Кажется, что это хрупкая вещь. Если найдёте дешевле — сброшу цену.`,
        "cost": 23817,
        "userId": 3,
        "typeId": 2
      },
      {
        "title": `Продам коллекцию журналов «Огонёк».`,
        "picture": `item06.jpg`,
        "description": `Не пытайтесь торговаться. Цену вещам я знаю. Пользовались бережно и только по большим праздникам.`,
        "cost": 56635,
        "userId": 1,
        "typeId": 2
      }
    ],
    "commentList": [
      {
        "userId": 5,
        "offerId": 1,
        "text": `Неплохо, но дорого. А сколько игр в комплекте?`
      },
      {
        "userId": 4,
        "offerId": 1,
        "text": `Вы что?! В магазине дешевле. А где блок питания? А сколько игр в комплекте?`
      },
      {
        "userId": 4,
        "offerId": 2,
        "text": `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "userId": 1,
        "offerId": 2,
        "text": `Почему в таком ужасном состоянии? Неплохо, но дорого. С чем связана продажа? Почему так дешёво?`
      },
      {
        "userId": 1,
        "offerId": 3,
        "text": `А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "userId": 5,
        "offerId": 3,
        "text": `А сколько игр в комплекте? Совсем немного...`
      },
      {
        "userId": 1,
        "offerId": 4,
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "userId": 4,
        "offerId": 4,
        "text": `А где блок питания? Почему в таком ужасном состоянии?`
      },
      {
        "userId": 2,
        "offerId": 5,
        "text": `Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`
      },
      {"userId": 2, "offerId": 5, "text": `Неплохо, но дорого.`}
    ]
  };

  await Category.bulkCreate(mockDBData.categoryList);
  await User.bulkCreate(mockDBData.userList);
  await OfferType.bulkCreate(mockDBData.offerTypeList);
  await Offer.bulkCreate(mockDBData.offerList);
  await Comment.bulkCreate(mockDBData.commentList);

  const dbOffersList = await Offer.findAll();
  await Promise.all(
      dbOffersList.map(async (offer) => {
        await offer.addCategories([1, 2]);
      })
  );
};

module.exports = {
  mockDb: {
    Category,
    User,
    Offer,
    Comment,
    OfferType,
  },
  sequelize,
  initAndFillMockDb,
};
