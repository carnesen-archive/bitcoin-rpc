'use strict';

function MemPoolInfo(info) {
  return {
    nTransactions: info.size,
    nBytes: info.bytes
  }
}

module.exports = MemPoolInfo;
