'use strict';

var spec = require('./spec');
var Request = spec.Request;
var methods = spec.methods;

/***
 * A Requests instance is a factory for creating JSON-RPC requests.
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
function Requests() {}

Requests.create = function() {
  return new Requests();
};

function createRequestsMethod(method) {
  Requests.prototype[method.name] = function(args) {
    return Request.create({
      method: method,
      args: method.params.serialize(args)
    });
  }
}

methods.forEach(createRequestsMethod);

module.exports = Requests;
