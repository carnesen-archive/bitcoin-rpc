'use strict';

var config = require('config');

var chai = require('chai');
chai.should();

var BitcoinJsonRpc = require('../lib');
var Client = BitcoinJsonRpc.Client;
var requests = BitcoinJsonRpc.requests;

var methods = require('../lib/spec/methods');

var client = BitcoinJsonRpc.Client.create(config.get('client'));

var methodsThatTakeTooLong = ['VerifyChain', 'GetTxOutSetInfo'];

describe('Client integration tests', function() {
  this.timeout(3000);

  methods.forEach(function(method) {
    var args = method.params.fields.map(function(field) {
      return (field.example === undefined) ? field.default : field.example;
    });
    var request = requests[method.name].apply(this, args);
    if(methodsThatTakeTooLong.indexOf(method.name) === -1) {
      it(method.name, function(done) {
        client.sendRequest(request, function(err, ret) {
          if(err) {
            return console.log(method.name, err);
          }
          done();
        })
      });
    }
  });
});