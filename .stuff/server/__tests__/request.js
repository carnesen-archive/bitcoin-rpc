'use strict';

require('simple-syrup-dev').should();

var Request = require('../request');
var Method = require('../method');

describe('Request', function() {

  var requestMock;
  beforeEach(function() {
    requestMock = Request.create({
      method: Method.create('GetFoo'),
      args: []
    });
  });

  it('randomizes id', function() {
    var request = new Request();
    request.id.should.not.equal(requestMock.id)
  });

  it('defaults to no jsonrpc', function() {
    requestMock.serialize().should.not.include.keys('jsonrpc');
  });

  it('can be set to jsonrpc 2.0', function() {
    requestMock.jsonRpc = Request.JSON_RPC_2;
    requestMock.serialize().should.include.keys('jsonrpc');
  });

  it('lowercases the method name', function() {
    requestMock.serialize().method.should.equal('getfoo');
  });

});
