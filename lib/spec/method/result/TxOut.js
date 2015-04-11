'use strict';

function TxOut(obj) {
  return {
    blockHash: obj.bestblock,
    nConfirmations: obj.confirmations,
     // transaction value in bitcoin
    value: obj.value,
    scriptPubKey: obj.scriptPubKey,
    version: obj.version,
    isCoinbase: obj.coinbase //bool
  }
}

module.exports = TxOut;
