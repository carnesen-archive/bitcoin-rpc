'use strict';

var http = require('http');
var https = require('https');
var EventEmitter = require('events').EventEmitter;
var sinon = require('sinon');
var chai = require('chai');
var should = chai.should();

var HttpClient = require('../../lib/client/http');

describe('HttpClient', function() {

  var clientMock;
  beforeEach(function() {
    var responseMock = new EventEmitter();
    var requestMock = new EventEmitter();
    requestMock.end = function(data) {
      this.emit('response', responseMock);
      setTimeout(function() {
        responseMock.emit('data', data);
        responseMock.emit('end');
      }, 5);
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

  it('uses https if specified', function() {
    var client = HttpClient.create({protocol: 'https'});
    client.protocol.should.equal(https);
  });

  it('has a sendJson method', function () {
    clientMock.sendJson('asdf');
  });

});
