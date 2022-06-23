// I'm guessing this kind of puts everything together?

// CORS stands for Cross-Origin Resource Sharing
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
var cors = require('cors');
var express = require('express');               // the app framework library
var path = require('path');                     // for joining paths
var cookieParser = require('cookie-parser');    // for parsing cookies
var logger = require('morgan');                 // for logging

var indexRouter = require('./routes/index');    // an express object that routes users to the root page /
var usersRouter = require('./routes/users');    // an express object that routes users to the page /users

var app = express();                            // instantiate the app object
app.use(cors());                                // adds CORS support

app.use(logger('dev'));                         // from here on, dunno
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const isProduction = process.env.NODE_ENV === "production";
const targetDir = isProduction ? '../../build' : 'public';

app.use(express.static(path.join(__dirname, targetDir)));
app.use('/', indexRouter);                      // sets the router for the root page /
app.use('/users', usersRouter);                 // sets the router for the /users page

// const db = require('./queries');
// app.get('/poems', db.getPoems);
// app.post('/poems', db.createPoem);

module.exports = app;
