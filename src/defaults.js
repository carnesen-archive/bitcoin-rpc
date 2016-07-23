'use strict';

const { platform } = require('os');

const expandHomeDir = require('expand-home-dir');

const dataDirMap = {
  darwin: '/Library/Application/...',
  win32: ''
};

module.exports = {
  dataDir: dataDirMap[platform()] || expandHomeDir('~/.bitcoin'),
  host: 'localhost',
  port: 8332,
  testnetPort: 18332
};
