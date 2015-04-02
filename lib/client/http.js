'use strict';

var http = require('http');
var https = require('https');

var bitcore = require('bitcore');
var $ = bitcore.util.preconditions;
var JSUtil = bitcore.util.js;

/***
 * An HttpClient instance can send json requests and receive json responses
 * by http or https (#TODO)
 * @param opts
 * @constructor
 */
function HttpClient(opts) {
  opts = opts || {};
  this.host = opts.host || '127.0.0.1';
  this.port = opts.port || bitcore.Networks.defaultNetwork.port - 1;
  this.username = opts.username || 'username';
  this.password = opts.password || 'password';
  this.protocol = (opts.protocol === 'https') ? https : http;
}

HttpClient.create = function(opts) {
  return new HttpClient(opts);
};

/***
 * POST's a json request string to the remote server
 * @param obj A JSON-RPC request object
 * @param callback A function called on the response
 */
HttpClient.prototype.sendJson = function(obj, callback) {
  callback = callback || function() {};
  $.checkArgument(obj);

  var json = JSON.stringify(obj);

  var httpOpts = {
    hostname: this.host,
    port: this.port,
    method: 'POST',
    headers: {
      'Content-Type': 'test/plain',
      'Content-Length': json.length,
      'Authorization': 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64')
    }
  };
  var httpRequest = this.protocol.request(httpOpts);
  var called = false;

  httpRequest.on('response', function(response) {
    var responseData = '';
    response.on('data', function(data) {
      responseData += data;
    });
    response.on('end', function() {
      if (called) { return; }
      called = true;
      if (JSUtil.isValidJSON(responseData)) {
        callback(null, JSON.parse(responseData));
      } else {
        callback(new Error('Failed to parse response:'));
      }
    });
  });

  httpRequest.on('error', function(err) {
    called = true;
    callback(err);
  });

  httpRequest.end(json);
};

module.exports = HttpClient;