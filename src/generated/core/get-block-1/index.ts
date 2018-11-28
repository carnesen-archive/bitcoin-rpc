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
  hash: string;
  confirmations: number;
  strippedsize?: number;
  size: number;
  weight?: number;
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
  nTx?: number;
};

export type Server = {
  subversion: string;
};
