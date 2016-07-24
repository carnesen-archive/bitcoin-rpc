'use strict';

const debug = require('debug');

const { name } = require('../package.json');

module.exports = debug(name);
