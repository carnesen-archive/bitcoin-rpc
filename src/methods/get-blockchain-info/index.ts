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
};

export type Result = {
  chain: string;
  blocks: number;
  headers: number;
  bestblockhash: string;
  difficulty: number;
  mediantime: number;
  verificationprogress: number;
  initialblockdownload: boolean;
  chainwork: string;
  size_on_disk: number;
  pruned: boolean;
  softforks: Softfork[];
  bip9_softforks: Bip9Softforks;
  warnings: string;
};

export type Bip9Softforks = {
  csv: CSV;
  segwit: CSV;
};

export type CSV = {
  status: string;
  startTime: number;
  timeout: number;
  since: number;
};

export type Softfork = {
  id: string;
  version: number;
  reject: Reject;
};

export type Reject = {
  status: boolean;
};

export type Server = {
  subversion: string;
};
