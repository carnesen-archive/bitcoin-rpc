'use strict';

var Request = require('./request');
var methods = require('./spec').methods;

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
  Requests.prototype[method.name] = function() {
    return Request.create({
      method: method,
      args: method.params.serialize.apply(method.params, arguments)
    });
  }
}

methods.forEach(createRequestsMethod);

module.exports = Requests;
