'use strict';

var bitcore = require('bitcore');

function Response(obj) {
  obj = obj || {};
  this.result = obj.result || null;
  this.error = (obj.error) ? new Error(obj.error.code + ': ' + obj.error.message) : null;
  this.id = obj.id || null;
  this.jsonRpc = obj.jsonrpc
}

Response.create = function(obj) {
  return new Response(obj);
};

module.exports = Response;
