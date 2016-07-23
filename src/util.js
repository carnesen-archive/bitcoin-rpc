'use strict';

const fs = require('fs');

function promisify(func) {

  return (...args) => new Promise((resolve, reject) => {

    func(...args, (err, ret) => {
      if (err) {
        return reject(err);
      }
      resolve(ret);
    });

  });
}

module.exports = {

  base64Encode(input) {
    return new Buffer(input, 'utf8').toString('base64')
  },

  readFile: promisify(fs.readFile),

  isUndefined(value) {
    return typeof value === 'undefined';
  }

};