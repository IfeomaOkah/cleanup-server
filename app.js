require('dotenv').config()
const express = require('express')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
const createError = require('http-errors')

mongoose
  .connect(process.env.MONGODB_URI, {
    userNewUrlParser : true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}`)
  })
  .catch(err => {
    console.log('Error connecting to mongo', err);
  })

app.use(session({
  secret:"the secret garden",
  resave: true,
  saveUninitialized: true
}));

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

function protect(req,res,next) {
  
  if(req.session.user) next()
  else next(createError(401))
}

app.use('/api', require('./routes/index'));

app.use('/api/api', require('./routes/auth-routes'));
app.use('/api/api', require('./routes/user-routes'));
app.use('/api/api', require('./routes/clean-routes'));
app.use('/api/api', protect, require('./routes/event-routes'));

app.use(function(err, req, res, next) {
  
  if(err) res.status(err.status).json({message: err.message})
  else res.status(500).json({message: "Something went wrong!"})
})

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`)
})

module.exports = app; 
