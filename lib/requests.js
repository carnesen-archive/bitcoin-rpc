'use strict';

var Spec = require('./spec');
var Request = require('./request');

/***
 * A Requests instance is a factory for creating JSON-RPC requests.
 *
 * @example
 * ```javascript
 * var reqs = Requests.create();
 *
 * jsonRpcClient.sendRequest(reqs.GetInfo())
 * ```
 *
 * @constructor
 */
function Requests(spec) {
  spec = spec || Spec.create();
  this._addMethods(spec);
}

Requests.create = function(spec) {
  return new Requests(spec);
};

Requests.prototype._addMethods = function(spec) {
  var self = this;
  spec.methods.forEach(function(method) {
    self[method.name] = function(params) {
      params = params || [];
      return Request.create({
        method: method.name,
        params: method.params.serialize(params),
        resultHandler: method.result
      });
    }
  })
};

module.exports = Requests;
