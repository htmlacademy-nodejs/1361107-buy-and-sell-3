"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../../../constants`);

class OffersService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    return this._offers;
  }

  findOne(id) {
    return this._offers.find((offer) => offer.id === id);
  }

  create(offerData) {
    const newOffer = {id: nanoid(MAX_ID_LENGTH), comments: [], ...offerData};

    this._offers.push(newOffer);

    return newOffer;
  }

  update(id, offerData) {
    const oldOfferIndex = this._offers.findIndex((offer) => offer.id === id);

    this._offers[oldOfferIndex] = {...this._offers[oldOfferIndex], ...offerData};

    return this._offers[oldOfferIndex];
  }

  delete(id) {
    const deletingOfferIndex = this._offers.findIndex((offer) => offer.id === id);

    if (deletingOfferIndex === -1) {
      return;
    }

    this._offers.splice(deletingOfferIndex, 1);
  }
}

module.exports = OffersService;
