'use strict';

var _ = require('lodash');

var bitcore = require('bitcore');

var BlockInfo = require('./BlockInfo');

/***
 * Result of a GetBlock request
 * @param obj
 * @returns object
 * @constructor
 */
function Block(obj) {
  if(_.isObject(obj)) {
    return BlockInfo(obj);
  } else {
    return bitcore.Block.fromString(obj);
  }
}

module.exports = Block;
