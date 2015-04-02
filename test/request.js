'use strict';

var chai = require('chai');
var should = chai.should();

var Request = require('../lib/request');

describe('Request', function() {

  var requestMock;
  beforeEach(function() {
    requestMock = Request.create({
      method: 'Foo',
      params: [],
      handler: function() {}
    });
  });

  it('instantiates from constructor', function() {
    var request = new Request();
    should.exist(request);
  });

  it('instantiates from create', function() {
    should.exist(requestMock);
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

  it('default handler is a pass-through function', function() {
    var request = new Request();
    request.handler('foo').should.equal('foo');
  });

});