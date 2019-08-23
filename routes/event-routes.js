const express = require('express');
const router  = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

const mongoose = require("mongoose");
const createError = require('http-errors')


router.get('/profile', (req, res, next)=>{
  Event.create({
    headline: req.body.headline,
    date: req.body.date,
    description: req.body.description,
    location: req.body.location, 
    cleaner: req.body.cleaner,
  })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    })
});

router.post("/create_event", (req,res,next)=> {
  let newEvent = req.body;
  newEvent.cleaner = mongoose.Types.ObjectId(req.session.user.id);

  Event.create(newEvent)
      .then((event)=> {
          return User.findByIdAndUpdate(req.session.user.id, {$push: {events: event._id}}, { new: true })
      })
      .then((user)=> {
        res.status(200).json({message: "event created"});
      })
      .catch((error)=> {
          console.log(error)
          if(error.name === "ValidationError") next(createError(400, error.message))
          else next(createError(500));
      })
})


router.post('/join/:id', (req, res, next) => {
  debugger
  Event.findByIdAndUpdate(req.params.id, {$push: { people: req.session.user.id }}, { new: true })
  .then(updatedEvent => {
    debugger
    return User.findByIdAndUpdate(req.session.user.id, {$push: { upcoming: updatedEvent._id }}, { new: true })
  })
  .then(updatedUser => {
    res.json(updatedUser)
  })
  .catch(err => {
    next(createError(500))
  })
});

router.get('/user-profile', (req, res, next) => {
  debugger
  User.findOne({_id: req.session.user.id})
  .populate("events")
  .populate("upcoming")
  .then(user => {
    debugger
    res.json(user)
  })
  .catch(err => {
    next(createError(500))    
  })
});

module.exports = router;