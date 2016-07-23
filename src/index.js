'use strict';

const { readFileSync } = require('fs');

const { parse } = require('ini');

const defaults = require('./defaults');
const methods = require('./methods');

module.exports = function createClient(options) {

  if (typeof options === 'undefined') {
    options = { dataDir: defaults.dataDir }
  }

  // validate options

  const { confFile, cookieFile, dataDir, rpcUser, rpcPassword, port, host } = options;



};
