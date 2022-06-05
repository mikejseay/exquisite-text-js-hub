// I'm guessing this kind of puts everything together?

const herokuDeploy = false;

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

if (herokuDeploy) {
    app.use(express.static(path.join(__dirname, '../../build')));
} else {
    app.use(express.static(path.join(__dirname, 'public')));
}

app.use('/', indexRouter);                      // sets the router for the root page /
app.use('/users', usersRouter);                 // sets the router for the /users page
// app.set('view engine', 'html');              // might be needed sometime?

module.exports = app;
