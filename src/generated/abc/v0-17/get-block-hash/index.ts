type GetBlockHash = {
  params: Params;
  result: string;
};

type Params = {
  height: number;
};

export type GetBlockHashParams = GetBlockHash['params'];
export type GetBlockHashResult = GetBlockHash['result'];
