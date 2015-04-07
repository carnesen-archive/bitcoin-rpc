'use strict';

var bitcore = require('bitcore');

var Response = require('./response');

function Request(opts) {
  opts = opts || {};
  this.id = bitcore.crypto.Random.getPseudoRandomBuffer(8).toString('hex');
  this.method = opts.method;
  this.params = opts.params;
  this.jsonRpc = (opts.jsonRpc === Request.JSON_RPC_2) ? Request.JSON_RPC_2 : null;
  this.callback = opts.callback;
}

Request.JSON_RPC_2 = '2.0';

Request.create = function(opts) {
  return new Request(opts);
};

Request.prototype.serialize = function() {
  var obj = {
    method: this.method.toLowerCase(),
    params: this.params,
    id: this.id
  };

  if (this.jsonRpc === Request.JSON_RPC_2) {
    obj['jsonrpc'] = this.jsonRpc;
  }

  return obj;
};

Request.prototype.handleResponse = function(obj) {
  var self = this;
  var response = Response.create(obj);
  if (response.id !== self.id) {
    return self.callback(new Error('Invalid response'));
  }
  if (response.error) {
    return self.callback(response.error);
  }
  self.callback(null, response.result);
};

module.exports = Request;
