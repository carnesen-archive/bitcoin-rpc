'use strict';

/***
 * Result of a GetBlock request with verbose set to true
 * @param obj
 * @returns object
 * @constructor
 */
function BlockInfo(obj) {
  return {
    hash: obj.hash,
    nConfirmations: obj.confirmations,
    bytes: obj.size,
    height: obj.height,
    blockVersion: obj.version,
    merkleRoot: obj.merkleroot,
    transactionIds: obj.tx,
    time: obj.time,
    nonce: obj.nonce,
    bits: obj.bits,
    difficulty: obj.difficulty,
    chainWork: obj.chainwork,
    previousBlockHash: obj.previousblockhash || null,
    nextBlockHash: obj.nextblockhash
  }
}

module.exports = BlockInfo;
