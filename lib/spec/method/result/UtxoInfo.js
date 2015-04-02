'use strict';

function UtxoInfo(obj) {
  return {
    blockHash: obj.bestblock,
    nConfirmations: obj.confirmations,
     // transaction value in bitcoin
    value: obj.value,
    scriptPubKey: obj.scriptPubKey,
    version: obj.version,
    coinbase: obj.coinbase //bool
  }
}

module.exports = UtxoInfo;
