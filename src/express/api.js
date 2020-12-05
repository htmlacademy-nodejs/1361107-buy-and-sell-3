"use strict";

const axios = require(`axios`);
const config = require(`../config`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async getOffers() {
    return this._load(`/offers`);
  }

  async getOffer(id) {
    return this._load(`/offers/${id}`);
  }

  async search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories() {
    return this._load(`/categories`);
  }

  async getComments(offerId) {
    return this._load(`/offers/${offerId}/comments`);
  }

  async createOffer(data) {
    return this._load(`/offers`, {
      method: `POST`,
      data,
    });
  }
}

const TIMEOUT = 2000;

const port = config.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
