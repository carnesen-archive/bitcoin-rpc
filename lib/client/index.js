'use strict';

var bitcore = require('bitcore');
var $ = bitcore.util.preconditions;

var HttpClient = require('./http');

/***
 * A Client instance sends requests and receives responses
 * @param httpClient
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

Client.prototype.sendRequest = function(request) {
  $.checkArgument(request);
  this.httpClient.sendJson(request.serialize(), function(err, ret) {
    if (err) {
      return request.callback(err);
    }
    return request.handleResponse(ret);
  });
};

module.exports = Client;
