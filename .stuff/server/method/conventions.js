'use strict';

function conventions(name) {
  var type;
  var alias = name.toLowerCase().replace(/_/g,'');

  //nConnections --> connections
  if (/^n[A-Z]/.test(name)) {
    type = 'Integer';
    alias = alias.slice(1);
  }

  if (/[Ss]econds$/.test(alias)) {
    type = 'Seconds';
    alias = alias.slice(0, -7);
  }

  if (/[Mm]illiseconds$/.test(alias)) {
    type = 'Milliseconds';
    alias = alias.slice(0, -12);
  }

  if (/[Ff]eeRate$/.test(alias)) {
    type = 'FeeRate';
    alias = alias.slice(0, -7);
  }

  if (name === 'outputIndex') {
    type = 'Integer';
    alias = 'vout';
  }

  if (/[Hh]eight$/.test(name)) {
    type = 'Integer';
  }

  if (/[Hh]ash$/.test(name)) {
    type = 'Hash';
  }

  if (name === 'verbose') {
    type = 'Boolean';
  }

  if (/^do[A-Z]/.test(name)) {
    type = 'Boolean';
  }

  if (/^is[A-Z]/.test(name)) {
    type = 'Boolean';
  }

  if (/[Vv]ersion$/.test(name)) {
    type = 'Integer';
  }

  if (/[Tt]ime$/.test(name)) {
    type = 'UnixTime';
  }

  if (/BTC$/.test(name)) {
    type = 'BTC';
  }

  if (/[Hh]ash$/.test(name)) {
    type = 'Hash';
  }

  if (/[Nn]ame$/.test(name)) {
    type = 'String';
  }

  if (/[Dd]ifficulty$/.test(name)) {
    type = 'Difficulty';
  }

  return { type: type, alias: alias };
}

// rules, xScore
// nonce, xWork, xHash, xCount, Length, xPriority, XopCodes
// xHex, xAddress, xScript, xBlock, xIndex, doX, xServices, data
// xSAT, account, asm, sequence, sigPubKey

module.exports = conventions;
