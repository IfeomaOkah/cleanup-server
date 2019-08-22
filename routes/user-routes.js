const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const User = require('../models/User');


// POST route => to create a new profile
router.post('/profile', (req, res, next)=>{
  User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob,
    email: req.body.email,
    password: req.body.password   
  })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    })
});


module.exports = router;