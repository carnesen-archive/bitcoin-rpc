'use strict';

var http = require('http');

/***
 * An HttpClient instance can send json requests and receive json responses
 * @param opts
 * @constructor
 */
function HttpClient(opts) {
  opts = opts || {};
  this.host = opts.host || '127.0.0.1';
  this.port = opts.port || 8332;
  this.username = opts.username || 'username';
  this.password = opts.password || 'password';
  this.protocol = http;
}

HttpClient.create = function(opts) {
  return new HttpClient(opts);
};

/***
 * POST's a json request string to the remote server
 * and calls back the json response
 * @param obj A JSON-RPC request object
 * @param callback A function called on the response
 */
HttpClient.prototype.sendJson = function(obj, callback) {
  callback = callback || function() {};

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

  var doCall = true;

  httpRequest.on('response', function(response) {

    var responseData = '';

    response.on('data', function(data) {
      responseData += data;
    });

    response.on('end', function() {
      if (!doCall) return;
      try {
        var parsed = JSON.parse(responseData);
      } catch(e) {
        return callback(new Error('Failed to parse response'));
      }
      callback(null, parsed);
    });

  });

  httpRequest.on('error', function(err) {
    callback(err);
    doCall = false;
  });

  httpRequest.end(json);
};

module.exports = HttpClient;