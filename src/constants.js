'use strict';

const { platform } = require('os');

const defaultDataDirMap = {
  darwin: '~/Library/Application Support/Bitcoin/',
  win32: resolve(process.env.APPDATA, 'Bitcoin')
};

module.exports = {
  options: {
    conf: {
      type: 'string',
      description: 'Path of the config file to use in datadir. A relative path is evaluated as relative to datadir.'
    },
    datadir: {
      type: 'string',
      description: 'Path to the bitcoin data directory. A relative path is evaluated as relative to the current working directory'
    },
    hostname: {
      type: 'string',
      description: 'Host name or IP address of the bitcoin service'
    },
    protocol: {
      type: 'string',
      description: 'protocol to use for RPC calls (http or https)'
    },
    rpcauth: {
      type: 'string',
      description: 'Username and hashed password for JSON-RPC connections. The field <userpw> comes in the format: <USERNAME>:<SALT>$<HASH>.'
    },
    rpcport: {
      type: 'integer',
      description: 'Port of the JSON-RPC interface. Default is 8332 or 18332 for testnet'
    },
    rpccookiefile: {
      type: 'string',
      description: 'Path to the RPC cookie file. A relative path is evaluated as relative to datadir'
    },
    rpcpassword: {
      type: 'string',
      description: 'Password for JSON-RPC connections'
    },
    rpcuser: {
      type: 'string',
      description: 'Username for JSON-RPC connections'
    },
    testnet: {
      type: 'integer',
      description: '1 for true (use the test chain)'
    }
  },
  defaults: {
    conf: 'bitcoin.conf',
    datadir: expandHomeDir(defaultDataDirMap[platform()] || '~/.bitcoin'),
    hostname: 'localhost',
    protocol: 'http',
    rpcport: testnet => testnet ? 18332 : 8332,
    rpccookiefile: '.cookie'
  }
};
