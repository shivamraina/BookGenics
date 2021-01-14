const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose');
const {genreSchema} = require('./genre')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  author: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  genres: {
    type: [genreSchema],
    validate: {
      validator : function(v){
        return v && v.length >0;
      }
    },
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // default: '5f8e96e373ddc13c6467162f'
    default: '5fc32ec491a4693efc4fc9b5'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

bookSchema.set('toJSON', { getters: true, virtuals: false });
const Book = mongoose.model('Book', bookSchema);

module.exports.Book = Book;
module.exports.bookSchema = bookSchema;