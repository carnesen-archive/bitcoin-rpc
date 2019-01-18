import { readConfigFiles } from '@carnesen/bitcoin-config';
import { inferRpcHrefFromConfig } from './infer-rpc-href-from-config';

export function readRpcHref(confFilePath?: string) {
  const config = readConfigFiles(confFilePath);
  const href = inferRpcHrefFromConfig(config);
  return href;
}
