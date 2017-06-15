'use strict';

const specs = require('./specs');
const util = require('util');

const errors = {};

Object.keys(specs).forEach(code => {
  const message = specs[code];
  errors[code] = class extends Error {
    constructor(...args) {
      super();
      this.message = util.format(message, ...args);
      this.code = code;
    }
  }
});

module.exports = errors;