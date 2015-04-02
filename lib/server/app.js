'use strict';

var express = require('express');
var morgan = require('morgan');
var http = require('http');

var bitcore = require('bitcore');

var Log = require('./../log');
var Bitcoind = require('./bitcoind');

function App(bd, opts) {
  this.bd = bd;
  this.port = parseInt(opts.port || 55438)
}

App.prototype.create = function(opts) {
  opts = opts || {};
  var bd = Bitcoind.create(opts.bitcoind);
  return new App(bd, opts.app, opts.log || new Log());
};

App.prototype.setupExpress = function() {
  var app = express();

  if (this.logging) {
    app.use(morgan('dev'));
  }

  // install routes
  app.use('/', routes(this.node));

  // catch 404 and forward to error handler
  app.use(function(req, res) {
    res.status(404).send('Not Found');
  });

  app.set('port', this.port);

  var server = http.createServer(app);
  server.on('error', this.onError.bind(this));
  server.on('listening', this.onListening.bind(this));

  this.app = app;
  this.server = server;
};

express.prototype.onError = function(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + this.port : 'Port ' + this.port;

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
};

/**
 * Event listener for HTTP server "listening" event.
 */
BitcoreHTTP.prototype.onListening = function() {
  var addr = this.server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
};


BitcoreHTTP.prototype.start = function() {
  this.server.listen(this.port);
};

module.exports = App;