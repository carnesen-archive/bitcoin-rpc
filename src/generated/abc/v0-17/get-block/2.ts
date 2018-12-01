export type GetBlock = {
  result: Result;
  params: Params;
};

export type Params = {
  blockhash: string;
  verbosity: 2;
};

export type Result = {
  hash: string;
  confirmations: number;
  size: number;
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
};

export type Tx = {
  txid: string;
  hash: string;
  size: number;
  version: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
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
