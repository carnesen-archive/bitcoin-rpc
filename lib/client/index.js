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

Client.prototype.sendRequest = function(request, callback) {
  $.checkArgument(request);
  callback = callback || function() {};
  this.httpClient.sendJson(request.serialize(), function(err, ret) {
    if(err) {
      callback(err);
    } else {
      callback(request.handler(ret));
    }
  });
};

module.exports = Client;
