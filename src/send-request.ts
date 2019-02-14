import { RpcRequest, RpcResponse } from './types';
import { sendData } from './send-data';

export const sendRequest = async (href: string, request: RpcRequest) => {
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
