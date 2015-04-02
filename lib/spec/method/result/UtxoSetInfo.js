'use strict';

function UtxoSetInfo(obj) {
  return {
    bestBlockHeight: obj.height,
    bestBlockHash: obj.bestblock,
    nTransactions: obj.transactions,
    nTransactionOutputs: obj.txouts,
    nBytesSerialized: obj.bytes_serialized,
    hashSerialized: obj.hash_serialized,
    totalAmountBTC: obj.total_amount
  };
}

module.exports = UtxoSetInfo;
