'use strict';

var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');

var Request = require('../../lib/request');
var Client = require('../../lib/client');

describe('Client', function() {

  var clientMock, requestMock, httpClientMock;
  beforeEach(function() {
    requestMock = Request.create();
    requestMock.serialize = sinon.spy();
    requestMock.handler = sinon.spy();
    httpClientMock = {
      sendJson: function(json, cb) {
        process.nextTick(function() { cb(null, '') });
      }
    };
    clientMock = Client.create();
    clientMock.httpClient = httpClientMock;
  });

  it('instantiates from constructor', function() {
    var client = new Client({});
    should.exist(client);
  });

  it('instantiates from create', function() {
    var client = Client.create();
    should.exist(client);
  });

  it('instantiates from create with opts', function() {
    var client = Client.create({foo: 'bar'});
    should.exist(client);
  });

  it('sendRequest calls callback on success', function (done) {
    clientMock.sendRequest(requestMock, function() { done(); });
  });

  it('sendRequest serializes the request', function () {
    clientMock.sendRequest(requestMock);
    requestMock.serialize.calledOnce.should.equal(true);
  });

  it('sendRequest calls the request handler', function (done) {
    requestMock.handler = function() { done() };
    clientMock.sendRequest(requestMock);
  });

  it('sendRequest returns error on sendJson error', function (done) {
    httpClientMock.sendJson = function(json, cb) {
      process.nextTick(cb('foo'))
    };
    clientMock.sendRequest(requestMock, function(err) {
      err.should.be.equal('foo');
      done();
    });
  });

});
