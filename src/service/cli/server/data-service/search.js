"use strict";

const {getSequelizeQueryOptions} = require(`../../../../constants`);

class SearchService {
  constructor(db) {
    this._db = db;
  }

  async findAll(searchText) {
    const offers = await this._db.Offer.findAll(
        getSequelizeQueryOptions(`Offer`, this._db)
    );

    return offers.filter((offer) =>
      offer.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}

module.exports = SearchService;
