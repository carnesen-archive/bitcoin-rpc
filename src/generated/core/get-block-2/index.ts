// This file is generated programmatically. Do not edit.

import * as examplesJson from './examples.json';
export const examples: Example[] = examplesJson;

export type Example = {
  server: Server;
  request: Request;
  result: Result;
};

export type Request = {
  method: string;
  params: Params;
};

export type Params = {
  blockhash: string;
  verbosity: number;
};

export type Result = {
  confirmations: number;
  strippedsize?: number;
  size: number;
  weight?: number;
  height: number;
  version: number;
  versionHex: string;
  merkleroot: string;
  tx: Tx[];
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  nTx?: number;
  hash?: string;
};

export type Tx = {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize?: number;
  weight?: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  hex?: string;
};

export type Vin = {
  coinbase: string;
  sequence: number;
};

export type Vout = {
  value: number;
  n: number;
  scriptPubKey: ScriptPubKey;
};

export type ScriptPubKey = {
  asm: string;
  hex: string;
  reqSigs: number;
  type: string;
  addresses: string[];
};

export type Server = {
  subversion: string;
};
