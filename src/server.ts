import * as http from 'http';
import { RpcRequest, RpcResponse } from './types';
import { URL } from 'url';

export const ERROR_CODES = {
  METHOD_NOT_FOUND: -32601,
};

export const BLOCK_HASH =
  '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206';

export const BLOCK_COUNT = 0;

export class RpcServer {
  private httpServer: http.Server;
  private readonly href: string;
  constructor(href: string) {
    this.href = href;
    const { username, password } = new URL(href);
    const encodedCredentials = Buffer.from(`${username}:${password}`, 'utf8').toString(
      'base64',
    );
    const expectedAuthorization = `Basic ${encodedCredentials}`;
    this.httpServer = http.createServer((req, res) => {
      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'text/html' });
        res.end('JSONRPC server handles only POST requests');
        return;
      }
      if (req.headers.authorization !== expectedAuthorization) {
        debugger;
        res.statusCode = 401; // Unauthorized
        res.end('');
        return;
      }
      if (req.url !== '/') {
        res.statusCode = 404; // Not found
        res.end('');
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
            sendResult(BLOCK_HASH);
            return;
          case 'getblockcount':
            sendResult(BLOCK_COUNT);
            return;
        }
        sendError('Method not found', ERROR_CODES.METHOD_NOT_FOUND);
        return;
      });
    });
  }

  public start(): Promise<void> {
    return new Promise(resolve => {
      const { port } = new URL(this.href);
      this.httpServer.once('listening', resolve);
      this.httpServer.listen(Number(port));
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

if (require.main === module) {
  const server = new RpcServer('http://carnesen:12345678@localhost:18440');
  server.start();
}
