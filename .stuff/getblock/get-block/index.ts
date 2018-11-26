export interface Examples {
  meta: Meta;
  result: ResultClass | string;
}

export interface Meta {
  method: string;
  version: string;
  params: Params;
}

export interface Params {
  blockhash: string;
  verbosity?: number;
}

export interface ResultClass {
  hash: string;
  confirmations: number;
  strippedsize: number;
  size: number;
  weight: number;
  height: number;
  version: number;
  versionHex: string;
  merkleroot: string;
  tx: Array<TxClass | string>;
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  nTx: number;
}

export interface TxClass {
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
}

export interface Vin {
  coinbase: string;
  sequence: number;
}

export interface Vout {
  value: number;
  n: number;
  scriptPubKey: ScriptPubKey;
}

export interface ScriptPubKey {
  asm: string;
  hex: string;
  reqSigs: number;
  type: string;
  addresses: string[];
}
