#!/usr/bin/env node

require('dotenv').config();

// import the http library
var http = require('http');

// var https = require('https');
// const fs = require('fs');
// var privateKey   = fs.readFileSync('./.cert/key.pem', 'utf8');
// var certificate  = fs.readFileSync('./.cert/cert.pem', 'utf8');
// var credentials = {key: privateKey, cert: certificate};


// import the Socket.IO library
var socketio = require('socket.io');

// app assembles the two routers and creates the express app and does its basic configuration
var app = require('./app');

// "poem" contains the logic for the poem application
var poem = require('./poem');


/**
 * Module dependencies.
 */

// no ideas... chat-server is the name in package.json?
// maybe server refers to the variable server inside this project?
var debug = require('debug')('chat-server:server');


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

// the http server that will listen on the port given by the app
var server = http.createServer(app);
// var server = https.createServer(credentials, app);

// the socket.io server which will handle socket-based messages
// in production, you might want to only allow certain clients
var io = socketio(server,{
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// runs the poem functionality defined in poem.js, which takes the io server as input,
// tells it to use the authenticator, and also tells it how to handle connection events (when someone opens the page)
// when someone opens the page and a connection object is created, that uses their socket to create a connection to the io server
// and tells that connection to get all existing messages, how to handle incoming messages, and how to send out a message
poem(io);

/**
 * Listen on provided port, on all network interfaces.
 */

// the server listens on the port for any incoming connections and maintains the connection over which
//
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// the below defines functions which are used above, they are mostly boilerplate and not necessary to read

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: string; }) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
