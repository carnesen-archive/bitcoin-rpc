'use strict';

const defaults = require('./defaults');

function createClient(options) {

  if (typeof options === 'undefined') {
    options = { dataDir: defaults.dataDir }
  }

  // validate options

  const { confFile, cookieFile, dataDir, rpcUser, rpcPassword, port, host } = options;

}

module.exports = createClient;