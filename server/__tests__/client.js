'use strict';

require('simple-syrup-dev').should();

var sinon = require('simple-syrup-dev').sinon;

var Request = require('../request');

var Client = require('../client');

describe('Client', function() {

  var clientMock, requestMock, httpClientMock;
  beforeEach(function() {
    requestMock = Request.create();
    requestMock.handleResponse = sinon.spy();
    requestMock.serialize = sinon.spy();
    httpClientMock = {
      sendJson: function(json, cb) {
        process.nextTick(function() { cb(null, '{error: null, result: "beef"') });
      }
    };
    clientMock = Client.create();
    clientMock.httpClient = httpClientMock;
  });

  it('sendRequest serializes the request', function () {
    clientMock.sendRequest(requestMock);
    requestMock.serialize.calledOnce.should.equal(true);
  });

  it('sendRequest calls error on sendJson error', function (done) {
    httpClientMock.sendJson = function(json, cb) {
      cb('bad');
    };
    clientMock.sendRequest(requestMock, function(err, ret) {
      done();
    });
  });

});
