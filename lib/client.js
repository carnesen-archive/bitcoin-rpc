'use strict';

var bitcore = require('bitcore');
var $ = bitcore.util.preconditions;

var spec = require('bitcoin-rpc-spec');
var Response = spec.Response;

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
  $.checkArgument(httpClient);
  this.httpClient = httpClient;
}

Client.create = function(opts) {
  opts = opts || {};
  var httpClient = HttpClient.create(opts);
  return new Client(httpClient);
};

Client.prototype.sendRequest = function(request, callback) {
  $.checkArgument(request);
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