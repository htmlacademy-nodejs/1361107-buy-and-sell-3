"use strict";

const {getSequelizeQueryOptions} = require(`../../../../constants`);

class CommentsService {
  constructor(db) {
    this._db = db;
  }

  async findAll(offer) {
    return await offer.getComments(getSequelizeQueryOptions(`Comment`, this._db));
  }

  async delete(offer, commentId) {
    await offer.removeComment(commentId);
  }

  async create(offer, commentData) {
    const newComment = await offer.createComment({offerId: offer.id, ...commentData});

    return newComment;
  }
}

module.exports = CommentsService;
