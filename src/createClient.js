'use strict';

const {format} = require('url');

const createBasicClient = require('./createBasicClient');
const createCookieClient = require('./createCookieClient');
const methods = require('./methods');
const readConf = require('./readConf');

function createClient(passed) {

  const options = readConf(passed);

  const { protocol, hostname, port, rpcauth, rpcpassword } = options;

  options.url = format({
    protocol,
    hostname,
    port
  });

  if (rpcauth || rpcpassword) {
    return createBasicClient(options);
  }

  return createCookieClient(options);

}

module.exports = createClient;
