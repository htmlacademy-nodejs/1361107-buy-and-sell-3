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

  async getOffers(page) {
    return this._load(`/offers`, {params: {page}});
  }

  async getDicussedOffers() {
    return this._load(`/offers/discussed`);
  }

  async getOffersByCategory(page, categoryId) {
    return this._load(`/offers/category/${categoryId}`, {params: {page}});
  }

  async getMyOffers(page, userEmail) {
    return this._load(`/offers/my`, {params: {page, userEmail}});
  }

  async getOffer(id) {
    return this._load(`/offers/${id}`);
  }

  async search(search, page) {
    return this._load(`/search`, {params: {search, page}});
  }

  async getCategory(id) {
    return this._load(`/categories/${id}`);
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

  async createComment(offerId, data) {
    return this._load(`/offers/${offerId}/comments`, {
      method: `POST`,
      data
    });
  }

  async deleteComment(offerId, commentId, userEmail) {
    return this._load(`/offers/${offerId}/comments/${commentId}`, {
      method: `DELETE`,
      params: {
        userEmail
      },
    });
  }

  async updateOffer(offerId, data, userEmail) {
    return this._load(`/offers/${offerId}`, {
      method: `PUT`,
      params: {
        userEmail
      },
      data
    });
  }

  async deleteOffer(offerId, userEmail) {
    return this._load(`/offers/${offerId}`, {
      method: `DELETE`,
      params: {
        userEmail
      },
    });
  }

  async createUser(data) {
    return await this._load(`/user/signup`, {
      method: `POST`,
      data,
    });
  }

  async loginUser(data) {
    return await this._load(`/user/login`, {
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
