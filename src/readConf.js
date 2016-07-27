'use strict';

const { isAbsolute, resolve } = require('path');
const { readFileSync } = require('fs');

const expandHomeDir = require('expand-home-dir');
const ini = require('ini');

const { defaults } = require('./constants');

module.exports = function readConf(passed) {

  passed = passed || {};

  const final = {};

  final.datadir = expandHomeDir(passed.datadir) || defaults.datadir;
  if (!isAbsolute(final.datadir)) {
    final.datadir = resolve(process.cwd(), final.datadir);
  }

  final.conf = expandHomeDir(passed.conf) || defaults.conf;
  if (!isAbsolute(final.conf)) {
    final.conf = resolve(final.datadir, final.conf);
  }

  final.hostname = passed.hostname || defaults.hostname;
  
  let config = {};
  try {
    const contents = readFileSync(final.conf, 'utf8');
    config = ini.parse(contents);
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  final.rpccookiefile = expandHomeDir(passed.rpccookiefile || config.rpccookiefile || defaults.rpccookiefile);
  if (!isAbsolute(final.rpccookiefile)) {
    final.rpccookiefile = resolve(final.datadir, final.rpccookiefile);
  }

  final.protocol = passed.protocol || defaults.protocol;
  final.testnet = passed.testnet || config.testnet;
  final.rpcport = passed.rpcport || config.rpcport || defaults.rpcport(final.testnet);
  final.rpcauth = passed.rpcauth || config.rpcauth;
  final.rpcuser = passed.rpcuser || config.rpcuser;
  final.rpcpassword = passed.rpcpassword || config.rpcpassword;

  return final;

};
