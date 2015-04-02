'use strict';

var BitcoinJsonRpc = require('./lib');

if (require.main === module) {
  var config = require('config');
  var client = BitcoinJsonRpc.Client.create(config.get('client'));
}
