'use strict';

function ChainInfo(info) {
  return {
    networkName: info.chain, // main | test | regtest (see BIP70)
    nBlocksProcessed: info.blocks,
    nHeadersValidated: info.headers,
    bestBlockHash: info.bestblockhash,
    difficulty: info.difficulty,
    verificationProgress: info.verificationprogress, // [0..1]
    chainWork: info.chainwork, // hex total work in active chain
  }
}

module.exports = ChainInfo;