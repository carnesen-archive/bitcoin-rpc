'use strict';

var bitcore = require('bitcore');

function Request(opts) {
  opts = opts || {};
  this.id = bitcore.crypto.Random.getPseudoRandomBuffer(8).toString('hex');
  this.method = opts.method;
  this.params = opts.params;
  this.jsonRpc = (opts.jsonRpc === Request.JSON_RPC_2) ? Request.JSON_RPC_2 : null;
  this.handler = opts.handler;
}

Request.JSON_RPC_2 = '2.0';

Request.create = function(opts) {
  return new Request(opts);
};

Request.prototype.serialize = function() {
  var obj = {
    method: this.method,
    params: this.params,
    id: this.id
  };

  if (this.jsonRpc === Request.JSON_RPC_2) {
    obj['jsonrpc'] = this.jsonRpc;
  }

  return obj;
};

module.exports = Request;
