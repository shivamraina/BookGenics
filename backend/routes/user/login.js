const express = require('express');
const bcrypt = require("bcrypt");
const {User} = require('../../models/user');
const validateLoginInput = require('../../validation/validateLoginInput');

const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validateLoginInput(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json({email:'Invalid Email'});
      
    const validPassword = await bcrypt.compare(req.body.password, user.password);   
    if(!validPassword) return res.status(400).json({password:'Wrong Password'});
      
    const token = user.generateAuthToken();
    res.json({
      success: true,
      token: token
    });
  }
  catch(err) {
    res.send(err);
  }
});

module.exports = router;