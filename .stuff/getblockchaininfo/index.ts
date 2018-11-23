type Bit9SoftFork = {
  status: string;
  startTime: number;
  timeout: number;
  since: number;
};

type SoftFork = {
  id: string;
  version: number;
  reject: {
    status: boolean;
  };
};

export type GetBlockchainInfoParams = never;
export type GetBlockchainInfoResult = {
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
  softforks: SoftFork[];
  bip9_softforks: {
    csv: Bit9SoftFork;
    segwit: Bit9SoftFork;
  };
  warnings: string;
};
