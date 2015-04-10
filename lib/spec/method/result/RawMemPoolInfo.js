'use strict';

/***
 * Result of a GetRawMemPool request with verbose set to true
 * @param obj
 * @returns ret
 */
function RawMemPoolInfo(obj) {
  var ret = {};
  for(var txid in obj) {
    var tx = obj[txid];
    ret[txid] = {
      nBytes: tx.size,
      fee: tx.fee,
      arrivalTime: tx.time,
      arrivalHeight: tx.height,
      arrivalPriority: tx.startingpriority,
      currentPriority: tx.currentpriority,
      unconfirmedParents: tx.depends
    }
  }
  return ret;
}

module.exports = RawMemPoolInfo;
