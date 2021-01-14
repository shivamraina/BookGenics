const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const { OTHERS, THRILLER, DRAMA, ROMANCE, ABSTRACT, INSPIRATIONAL, FANSTASY, CHILDREN_STORIES, CHILDREN, TRAGEDY, HORROR, CLASSICS, ACTION, COMEDY, CRIME} = require('../utils/genreNames');

module.exports = function(book) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),

    author: Joi.string().min(3).max(100).required(),
    
    content: Joi.string().min(3).required(),
    genres: Joi.array()
    // genres: Joi.array().items(Joi.object({
    //     // _id: Joi.objectId().required(),
    //     name: Joi.valid(OTHERS,  THRILLER, DRAMA, ROMANCE, ABSTRACT, INSPIRATIONAL, FANSTASY, CHILDREN_STORIES, CHILDREN, TRAGEDY, HORROR, CLASSICS, ACTION, COMEDY, CRIME).required()
    // })).min(1).required()
  
  });
  const result = schema.validate(book);
  return result;
}