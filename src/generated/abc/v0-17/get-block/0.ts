export type GetBlock = {
  result: string;
  params: Params;
};

export type Params = {
  blockhash: string;
  verbosity: 0;
};
