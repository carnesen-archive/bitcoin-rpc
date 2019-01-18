import * as http from 'http';
import { CodedError } from '@carnesen/coded-error';
import { RpcRequest, RpcResponse } from './types';
import { URL } from 'url';

const sendData = (href: string, data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = new URL(href);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      auth: `${url.username}:${url.password}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    });

    req.once('response', (res: http.IncomingMessage) => {
      let responseData = '';
      if (res.statusCode !== 200) {
        const err = new CodedError(
          `http response code was ${res.statusCode}, "${res.statusMessage}"`,
          res.statusCode,
        );
        reject(err);
        return;
      }
      res.on('data', chunk => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve(responseData);
      });
    });

    req.on('error', (err: NodeJS.ErrnoException) => {
      reject(new CodedError(`http request failed "${err.message}"`, err.code));
    });

    req.end(data);
  });
};

const sendRequest = async (href: string, request: RpcRequest) => {
  const data = JSON.stringify(request);
  const responseData = await sendData(href, data);
  let response: RpcResponse;
  try {
    response = JSON.parse(responseData);
  } catch (ex) {
    throw new Error(`Failed to parse response data "${ex.message}"`);
  }
  return response;
};

const getRandomId = () =>
  Math.random()
    .toString(36)
    .slice(2);

export function createBitcoinRpc(href: string) {
  return async function bitcoinRpc(method: string, params?: RpcRequest['params']) {
    const response = await sendRequest(href, {
      method,
      params,
      id: getRandomId(),
    });
    const { error, result } = response;
    if (error) {
      throw new CodedError(error.message, error.code, error.data);
    }
    return result;
  };
}
