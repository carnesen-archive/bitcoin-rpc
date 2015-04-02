'use strict';

module.exports = function Info(obj) {
  return {
    serverVersion: obj.version,
    protocolVersion: obj.protocolversion,
    walletVersion: obj.walletversion,
    balance: obj.balance,
    nBlocksProcessed: obj.blocks,
    timeOffset: obj.timeoffset,
    nConnections: obj.connections,
    proxy: obj.proxy,
    difficulty: obj.difficulty,
    testnet: obj.testnet,
    // seconds since GMT epoch) of the oldest pre-generated key in the key pool
    keyPoolOldest: obj.keypoololdest,
    keyPoolSize: obj.keypoolsize,
    // Unix time until which the wallet is unlocked for transfers (0 if locked)
    unlockedUntil: obj.unlocked_until,
    // Minimum relay fee for non-free transactions in btc/kb
    payTxFee: obj.paytxfee, // btc/kb
    relayFee: obj.relayFee,
    errors: obj.errors
  }
};
