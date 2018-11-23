export type GetBlockParams<V extends 0 | 1 | 2> = {
  blockhash: string;
  verbose?: V;
};
export type GetBlockResult0 = string;
export type GetBlockResult1 = {
  hash: string;
  confirmations: number;
  strippedsize: number;
  size: number;
  weight: number;
  height: number;
  version: number;
  versionHex: string;
  merkleroot: string;
  tx: string[];
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  nTx: number;
  previousblockhash: string;
  nextblockhash: string;
};

type Vin = {
  coinbase?: string;
  sequence: number;
  txid?: string;
  vout?: number;
  scriptSig?: ScriptSig;
};

type ScriptSig = {
  asm: string;
  hex: string;
};

type ScriptPubKey = {
  asm: string;
  hex: string;
  reqSigs?: number;
  type: string;
  addresses?: string[];
};

type Vout = {
  value: number;
  n: number;
  scriptPubKey: ScriptPubKey;
};

type Tx = {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  hex: string;
};

export type GetBlockResult2 = {
  hash: string;
  confirmations: number;
  strippedsize: number;
  size: number;
  weight: number;
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
  nTx: number;
  previousblockhash: string;
  nextblockhash: string;
};

export type GetBlockResult<V> = V extends 0
  ? GetBlockResult0
  : V extends 1 ? GetBlockResult1 : V extends 2 ? GetBlockResult2 : GetBlockResult1;
