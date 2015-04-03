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
  this.spec = spec;
  this._addMethods();
}

Requests.create = function(spec) {
  return new Requests(spec);
};

Requests.prototype._addMethod = function(method) {
  this[method.name] = function(params) {
    params = params || [];
    return Request.create({
      method: method.name,
      params: method.params.serialize(params),
      handler: method.result.deserialize.bind(method.result)
    });
  }
};

Requests.prototype._addMethods = function() {
  this.spec.methods.forEach(this._addMethod.bind(this));
};

module.exports = Requests;
