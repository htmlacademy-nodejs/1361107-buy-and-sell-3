"use strict";

const {getSequelizeQueryOptions} = require(`../../../../constants`);
const {db} = require(`../db/db`);

class SearchService {
  async findAll(searchText) {
    const offers = await db.Offer.findAll(
        getSequelizeQueryOptions(`Offer`, db)
    );

    return offers.filter((offer) =>
      offer.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}

module.exports = SearchService;
