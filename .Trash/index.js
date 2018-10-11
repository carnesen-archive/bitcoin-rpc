'use strict';

var BitcoinRPC = {
  Client: require('./server/client'),
  requests: require('./server/requests').create(),
  spec: require('./server/spec')
};

module.exports = BitcoinRPC;
