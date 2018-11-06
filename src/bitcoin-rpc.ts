type BitcoinRpcRequest = {
  method: string;
  params?: unknown;
};

type BitcoinRpcResponse = {
  result: unknown;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
};

const callBitcoinRpc = async (options: {
  url?: string;
  auth?: string;
  request: BitcoinRpcRequest;
}) => {
  return {} as BitcoinRpcResponse;
};

class RpcClient {
  async send(req: BitcoinRpcRequest<string>) {
    // await httpSend();
  }
  async getInfo2() {
    return {} as NonVerboseResult;
  }
}

const client = new RpcClient();
