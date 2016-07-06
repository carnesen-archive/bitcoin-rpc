'use strict';

/***
 * A Response instance contains the result of a request
 * @param request
 * @constructor
 */
function Response(request) {
  this.method = request.method;
  this.result = null;
  this.error = null;
  this.id = request.id || null;
  this.jsonRpc = null;
}

Response.create = function(request) {
  return new Response(request);
};

Response.prototype.receive = function(obj) {
  if (!this.error) {
    if (obj.error) {
      this.error = obj.error.code + ': ' + obj.error.message;
    } else if (this.id && obj.id !== this.id) {
      this.error = 'Invalid response ID. Expected: ' + this.id + '. Got: ' + obj.id;
    }
  }
  if(this.error) {
    this.result = null
  } else {
    var resultField = this.method.result;
    this.result = resultField.deserialize.bind(resultField)(obj.result);
  }
};

module.exports = Response;
