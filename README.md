bitcoin-rpc
================

[![Build Status](https://travis-ci.org/carnesen/bitcoin-rpc.svg)](https://travis-ci.org/carnesen/bitcoin-rpc)
[![Coverage Status](https://coveralls.io/repos/carnesen/bitcoin-rpc/badge.svg)](https://coveralls.io/r/carnesen/bitcoin-rpc)

[![NPM](https://nodei.co/npm/bitcoin-rpc.png)](https://nodei.co/npm/bitcoin-rpc/)

Examples
--------

```node
var config = require('config');
var rpc = require('bitcoin-rpc');

var opts = config.get('client');
var client = rpc.Client.create(opts);
var requests = rpc.requests;

client.sendRequest(requests.GetInfo(), console.log);
client.sendRequest(requests.ValidateAddress('19zc6mD19EiKgCbkbsd9h4jZuaYnezxBn6'), console.log);
```
