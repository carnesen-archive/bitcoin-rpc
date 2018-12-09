import * as http from 'http';
import { RpcRequest, RpcResponse, RpcOptions } from './types';

export class RpcServer {
  private httpServer: http.Server;
  private readonly options: RpcOptions;
  constructor(options: RpcOptions) {
    this.httpServer = http.createServer((req, res) => {
      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'text/html' });
        res.end('JSONRPC server handles only POST requests');
        return;
      }
      const { authorization } = req.headers;
      let authorized = false;
      if (authorization) {
        const firstSixChars = authorization.slice(0, 6);
        if (firstSixChars === 'Basic ') {
          const restChars = authorization.slice(6);
          const decoded = Buffer.from(restChars, 'base64').toString('utf8');
          const [rpcuser, rpcpassword] = decoded.split(':');
          authorized =
            rpcuser === this.options.rpcuser && rpcpassword === this.options.rpcpassword;
        }
      }
      if (!authorized) {
        res.statusCode = 401;
        res.end();
        return;
      }
      if (req.url !== '/') {
        res.statusCode = 404;
        res.end();
        return;
      }
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        const bitcoinRpcRequest: RpcRequest = JSON.parse(data);
        const { method, params, id = null } = bitcoinRpcRequest;
        const sendResponse = (bitcoinRpcResponse: RpcResponse) => {
          res.end(JSON.stringify(bitcoinRpcResponse));
        };
        const sendError = (message: string, code: number) =>
          sendResponse({
            id,
            result: null,
            error: {
              code,
              message,
            },
          });
        const sendResult = (result: any) =>
          sendResponse({
            id,
            result,
            error: null,
          });
        switch (method) {
          case 'getbestblockhash':
            sendResult(
              '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206',
            );
            return;
          case 'getblockcount':
            sendResult(0);
            return;
        }
        sendError('Method not found', -32601);
        return;
      });
    });
    this.options = options;
  }

  public start(): Promise<void> {
    return new Promise(resolve => {
      this.httpServer.once('listening', resolve);
      this.httpServer.listen(Number(this.options.rpcport));
    });
  }

  public stop(): Promise<void> {
    return new Promise(resolve => {
      this.httpServer.close(() => {
        resolve();
      });
    });
  }
}
