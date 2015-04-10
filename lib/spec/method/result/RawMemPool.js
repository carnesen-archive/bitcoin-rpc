'use strict';

var _ = require('lodash');

var bitcore = require('bitcore');

var RawMemPoolInfo = require('./RawMemPoolInfo');

/***
 * Result of a GetBlock request
 * @param obj
 * @returns object
 */
function RawMemPool(obj) {
  if(_.isArray(obj)) {
    return obj;
  } else {
    return RawMemPoolInfo(obj);
  }
}

module.exports = RawMemPool;
