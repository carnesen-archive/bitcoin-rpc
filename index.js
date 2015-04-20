'use strict';

var BitcoinJsonRpc = require('./lib');
var requests = BitcoinJsonRpc.requests;

if (require.main === module) {
  var config = require('config');
  var client = BitcoinJsonRpc.Client.create(config.get('client'));
  var request = requests.GetInfo();
  client.sendRequest(request, console.log);
}
