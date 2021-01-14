const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require('config');
const {genreSchema} = require('./genre');
const {bookSchema} = require('./book');

const userSchema = new mongoose.Schema({
  // _id:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   default: '5f8e96e373ddc13c6467162f'
  // },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    trim: true
  },  
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  genresPreferred: {
    type: [genreSchema],
    validate: {
      validator : function(v){
        return v && v.length >0;
      }
    },
    required: true
  },
  favorites : [bookSchema]
});

// userSchema.set('toJSON', { getters: true, virtuals: false });

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id,  name: this.name, email:this.email, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports.User = User;
module.exports.userSchema = userSchema;