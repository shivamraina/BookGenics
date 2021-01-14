const Joi = require('joi');

const { OTHERS, THRILLER, DRAMA, ROMANCE, ABSTRACT, INSPIRATIONAL, FANSTASY, CHILDREN_STORIES, CHILDREN, TRAGEDY, HORROR, CLASSICS, ACTION, COMEDY, CRIME} = require('../utils/genreNames');

module.exports = function(genre) {
  const schema = Joi.object({
    name: Joi.valid(OTHERS,  THRILLER, DRAMA, ROMANCE, ABSTRACT, INSPIRATIONAL, FANSTASY, CHILDREN_STORIES, CHILDREN, TRAGEDY, HORROR, CLASSICS, ACTION, COMEDY, CRIME).required()
  });
  return schema.validate(genre);
};