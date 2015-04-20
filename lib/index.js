'use strict';

var BitcoinJsonRpc = {};

BitcoinJsonRpc.Client = require('./client');
BitcoinJsonRpc.requests = require('./requests').create();

module.exports = BitcoinJsonRpc;
