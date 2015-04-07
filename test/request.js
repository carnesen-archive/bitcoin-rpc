'use strict';

var chai = require('chai');
var should = chai.should();

var Request = require('../lib/request');

describe('Request', function() {

  var requestMock;
  beforeEach(function() {
    requestMock = Request.create({
      method: 'Foo',
      params: []
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
    var request = Request.create({method: 'Foo', jsonRpc: Request.JSON_RPC_2});
    request.serialize().should.include.keys('jsonrpc');
  });

  it('has default no-op callback', function() {
    var request = new Request();
    request.callback.should.not.throw();
  });

  it('calls back "Invalid response" if response ID differs from request', function(done) {
    requestMock.callback = function(err) {
      err.message.should.equal('Invalid response');
      done();
    };
    requestMock.handleResponse({id: 'not beef'});
  });

  it('calls back error if response contains error', function(done) {
    requestMock.callback = function(err) {
      err.message.should.equal('99: This is an error message');
      done();
    };
    requestMock.handleResponse({
      error: {
        message: 'This is an error message',
        code: 99
      },
      id: requestMock.id
    });
  });

  it('calls back response.result if no error', function(done) {
    requestMock.callback = function(err, ret) {
      ret.foo.should.equal('bar');
      done();
    };
    requestMock.handleResponse({
      result: {foo: 'bar'},
      id: requestMock.id
    });
  });
});
