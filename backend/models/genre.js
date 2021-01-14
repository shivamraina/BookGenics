const mongoose = require('mongoose');
const { OTHERS, THRILLER, DRAMA, ROMANCE, ABSTRACT, INSPIRATIONAL, FANSTASY, CHILDREN_STORIES, CHILDREN, TRAGEDY, HORROR, CLASSICS, ACTION, COMEDY, CRIME} = require('../utils/genreNames');

const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
    lowercase: true,
    enum: [ OTHERS,  THRILLER, DRAMA, ROMANCE, ABSTRACT, INSPIRATIONAL, FANSTASY, CHILDREN_STORIES, CHILDREN, TRAGEDY, HORROR, CLASSICS, ACTION, COMEDY, CRIME ]
	}
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;