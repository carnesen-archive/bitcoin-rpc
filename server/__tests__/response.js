'use strict';

require('simple-syrup-dev').should();

var Response = require('../response');
var Request = require('../request');
var Method = require('../method');

describe('Response', function() {

  var responseMock, requestMock;
  beforeEach(function() {
    var methodMock = new Method('GetFoo');
    requestMock = new Request({method: methodMock});
    responseMock = Response.create(requestMock);
  });

  it('sets id', function() {
    responseMock.id.should.equal(requestMock.id);
  });

  it('sets error if response contains error', function() {
    responseMock.receive({error: {message: 'bad', code: 911}});
    responseMock.error.should.equal('911: bad');
  });

  it('sets error "Invalid response" if response ID differs from request', function() {
    responseMock.receive({id: null});
    responseMock.error.should.contain('Invalid response');
  });

  it('sets result if no error', function() {
    responseMock.receive({id: responseMock.id, result: 'bar'});
    responseMock.result.should.equal('bar');
  });

  it('sets result to null on error', function() {
    responseMock.receive({id: 'not 1234', result: 'bar'});
    true.should.equal(responseMock.result === null);
  });
});
