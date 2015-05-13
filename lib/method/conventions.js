'use strict';

function conventions(name) {
  var type = 'Object';
  var alias = name.toLowerCase().replace(/_/g,'');

  //nConnections --> connections

  if (/^n[A-Z]/.test(name)) {
    type = 'Integer';
    alias = alias.slice(1);
  }

  if (/seconds$/.test(alias)) {
    type = 'Seconds';
    alias = alias.slice(0, -7);
  }

  if (/milliseconds$/.test(alias)) {
    type = 'Milliseconds';
    alias = alias.slice(0, -12);
  }

  if (/feerate$/.test(alias)) {
    type = 'FeeRate';
    alias = alias.slice(0, -7);
  }

  if (name === 'outputIndex') {
    type = 'Integer';
    alias = 'vout';
  }

  return { type: type, alias: alias };
}

// rules, xSeconds, xMilliseconds, xFeeRate, xScore
// xBTC, difficulty, xVersion, xTime, isX, xString, xHeight
// nonce, xWork, xHash, xCount, Length, xPriority, XopCodes
// xHex, xAddress, xScript, xBlock, xIndex, doX, xServices, data
// xSAT, account, asm, sequence, sigPubKey

module.exports = conventions;
