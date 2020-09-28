"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../../../constants`);

class CommentsService {
  findAll(offer) {
    return offer.comments;
  }

  delete(offer, commentId) {
    const commentIndex = offer.comments.findIndex((comment) => comment.id === commentId);

    return commentIndex === -1 ? null : offer.comments.splice(commentIndex, 1);
  }

  create(offer, commentData) {
    const newComment = {id: nanoid(MAX_ID_LENGTH), ...commentData};

    offer.comments.push(newComment);

    return newComment;
  }
}

module.exports = CommentsService;
