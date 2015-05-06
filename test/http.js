'use strict';

var http = require('http');
var EventEmitter = require('events').EventEmitter;
var sinon = require('sinon');
var chai = require('chai');
var should = chai.should();

var HttpClient = require('../lib/http');

describe('HttpClient', function() {

  var clientMock, requestMock, responseData;
  beforeEach(function() {
    responseData = '{}';
    var responseMock = new EventEmitter();
    requestMock = new EventEmitter();
    requestMock.on('error', function() {});
    requestMock.end = function() {
      this.emit('response', responseMock);
      process.nextTick(function() {
        responseMock.emit('data', responseData);
        responseMock.emit('end');
      });
    };
    var httpMock = { request: sinon.stub().returns(requestMock) };
    clientMock = HttpClient.create();
    clientMock.protocol = httpMock;
  });

  it('instantiates from constructor', function() {
    var client = new HttpClient();
    should.exist(client);
  });

  it('instantiates from create', function() {
    var client = HttpClient.create();
    should.exist(client);
  });

  it('instantiates from create with opts', function() {
    var client = HttpClient.create({foo: 'bar'});
    should.exist(client);
  });

  it('defaults to http', function() {
    var client = HttpClient.create();
    client.protocol.should.equal(http);
  });

  it('has a sendJson method', function () {
    clientMock.sendJson('asdf');
  });

  it('does not call the callback both on error, end', function () {
    clientMock.sendJson('asdf');
    requestMock.emit('error');
  });

  it('calls back "Failed to parse response" on bad JSON', function (done) {
    responseData = 'this text is not valid json';
    clientMock.sendJson('asdf', function(err) {
      err.message.should.equal('Failed to parse response');
      done();
    });
  });

});
