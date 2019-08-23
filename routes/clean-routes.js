const express = require('express');
const router  = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

const mongoose = require("mongoose");
const createError = require('http-errors')

router.get('/cleanups', (req, res, next) => {
  Event.find({})
  .populate("people")
  .populate("cleaner")
  .then(events => {
    console.log(events)
    res.json(events)})
  .catch(err => {
    next(createError(500))
  })
});

router.get('/cleanups/:id', (req, res, next) => {
  
  Event.findById(req.params.id)
  .populate("people")
  .populate("cleaner")
  .then(event => {
    res.json(event)})
  .catch(err => {
    next(createError(500))
  })
});

module.exports = router;