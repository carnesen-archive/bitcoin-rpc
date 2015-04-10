'use strict';

var BitcoinJsonRpc = require('./lib');
var requests = BitcoinJsonRpc.Requests.create();

if (require.main === module) {
  var config = require('config');
  var client = BitcoinJsonRpc.Client.create(config.get('client'));
  client.sendRequest(requests.GetInfo(), console.log);
}
