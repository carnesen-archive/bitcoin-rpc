import { CodedError } from '@carnesen/coded-error';

import { RpcRequest } from './types';
import { sendRequest } from './send-request';

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
