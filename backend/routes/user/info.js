const express = require('express');
const Joi = require('joi');
const { User } = require('../../models/user');
const bcrypt = require('bcrypt');
const auth = require('../../middleware/auth');
const router = express.Router();

function validate(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    genres: Joi.array()
  });
  return schema.validate(user);
}

function validatePassInput(user) {
  const schema = Joi.object({
    currPass: Joi.string().min(5).max(255).required(),
    newPass: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}

router.get('/', auth, async(req, res) => {
  try{
    const user = await User.findById(req.user._id);
    res.send({
      name: user.name,
      email: user.email,
      genres: user.genresPreferred
    });
  }
  catch(ex) {
    res.send(ex);
  }
});

router.put('/', auth, async(req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  try{
    
    let user = await User.findOne({email: req.body.email});
    if(user && (user._id.toString() !== req.user._id.toString())) return res.status(400).send('Email already exists');

    user = await User.findById(req.user._id);
    user.name = req.body.name;
    user.email = req.body.email;
    user.genresPreferred = req.body.genres;
    await user.save();
    res.send({
      name: user.name,
      email: user.email,
      genres: user.genresPreferred
    });
  }
  catch(ex) {
    res.send(ex);
  }
});

router.put('/pass', auth, async(req, res) => {
  const { error } = validatePassInput(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  try{
    
    let user = await User.findOne({email: req.user.email});
    const validPassword = await bcrypt.compare(req.body.currPass, user.password); 
    if(!validPassword) return res.status(400).send('Invalid Password');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPass, salt);
    await user.save();
    res.send('OK');
  }
  catch(ex) {
    res.send(ex);
  }
});

module.exports = router;