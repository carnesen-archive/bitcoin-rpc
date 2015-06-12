'use strict';

var BitcoinRPC = {
  Client: require('./lib/client'),
  requests: require('./lib/requests').create(),
  spec: require('./lib/spec')
};

module.exports = BitcoinRPC;
