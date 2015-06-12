'use strict';

var Scalar = require('./method/scalar');

/***
 * A Request instance holds the details of an RPC request
 * @param opts
 * @constructor
 */
function Request(opts) {
  opts = opts || {};
  this.id = opts.id || parseInt(Math.random() * 1000000);
  this.method = opts.method;
  this.args = opts.args;
  this.jsonRpc = (opts.jsonRpc === Request.JSON_RPC_2) ? Request.JSON_RPC_2 : null;
}

Request.create = function(opts) {
  return new Request(opts);
};

Request.JSON_RPC_2 = '2.0';

/***
 * Returns the JSON-RPC object version of the request
 * @returns {{method: string, params: *, id: *}}
 */
Request.prototype.serialize = function() {
  var obj = {
    method: Scalar.create('MethodName').serialize(this.method.name),
    params: this.method.params.serialize.apply(this.method.params, this.args)
  };

  if (this.jsonRpc === Request.JSON_RPC_2) {
    obj['jsonrpc'] = this.jsonRpc;
  }

  if (this.id) {
    obj.id = this.id;
  }

  return obj;
};

module.exports = Request;
