'use strict';

var Response = require('./response');

var HttpClient = require('./http');

/***
 * A Client instance sends requests and receives responses
 * Requests instance is a factory for creating JSON-RPC requests.
 *
 * @example
 * ```javascript
 * var BitcoinJsonRpc = require('bitcoin-json-rpc');
 * var requests = BitcoinJsonRpc.Requests.create();
 *
 * client.sendRequest(requests.GetInfo(console.log))
 * ```
 *
 * @constructor
 */

function Client(httpClient) {
  this.httpClient = httpClient;
}

Client.create = function(opts) {
  opts = opts || {};
  var httpClient = HttpClient.create(opts);
  return new Client(httpClient);
};

Client.prototype.sendRequest = function(request, callback) {
  callback = callback || function() {};
  this.httpClient.sendJson(request.serialize(), function(err, ret) {
    if(err) {
      return callback(err);
    }
    var response = Response.create(request);
    response.receive.bind(response)(ret);
    if (response.error) {
      return callback(new Error(response.error));
    }
    callback(null, response.result);
  });
};

module.exports = Client;
