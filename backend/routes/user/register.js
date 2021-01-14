const express = require('express');
const bcrypt = require("bcrypt");
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const validateRegisterInput = require('../../validation/validateRegisterInput');

const router = express.Router();

router.post('/', async (req, res) => {
  
  try {
    
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('Email already exists');
    if(!(req.body.genresPreferred && req.body.genresPreferred.length >0)) 
      return res.status(400).send('Preferred Genres can\'t be empty!');
    
    genresArray=[]
    for (let id of  req.body.genresPreferred) {
      let genre = await Genre.findById(id);
      if(!genre) return res.status(400).send('Invalid Genre Id');
      genresArray.push(genre);
    }
    
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      genresPreferred: genresArray
    });
      
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.send('OK');
  }
  catch(err) {
    res.send(err);
  }
});

router.post('/check', async (req, res) => {
  const { error } = validateRegisterInput(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  try {
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('Email already exists');
    res.send('OK');
  }
  catch(ex){
    res.send(ex);
  }
});

module.exports = router;