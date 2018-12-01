export type GetBlock = {
  result: Result;
  params: Params;
};

export type Params = {
  blockhash: string;
  verbosity: 1;
};

export type Result = {
  hash: string;
  confirmations: number;
  size: number;
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
};
