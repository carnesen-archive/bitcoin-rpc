import { readConfigFiles } from '@carnesen/bitcoin-config';
import { inferRpcHrefFromConfig } from './infer-rpc-href-from-config';

export function readRpcHref(configFilePath?: string) {
  const config = readConfigFiles(configFilePath);
  const href = inferRpcHrefFromConfig(config);
  return href;
}
