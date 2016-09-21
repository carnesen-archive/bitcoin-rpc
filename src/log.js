'use strict';

const { createLogger } = require('@carnesen/util');

const { moduleName } = require('./constants');

module.exports = createLogger(moduleName);
