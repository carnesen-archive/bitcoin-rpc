import { URL } from 'url';
import { readFileSync } from 'fs';

import {
  readConfigFiles,
  toAbsolute,
  getDefaultConfig,
  getChainName,
} from '@carnesen/bitcoin-config';
import { parseHost } from './parse-host';
import { CodedError } from '@carnesen/coded-error';

export function readRpcHref(configFilePath: string) {
  const config = readConfigFiles(configFilePath);
  const chainName = getChainName(config);
  const defaultConfig = getDefaultConfig(chainName);

  // Determine hostname and port
  const parsedDefaultRpcconnect = parseHost(defaultConfig.rpcconnect);
  let { hostname } = parsedDefaultRpcconnect;
  let port: number = defaultConfig.rpcport;
  if (config.rpcconnect) {
    const parsedRpcconnect = parseHost(config.rpcconnect);
    hostname = parsedRpcconnect.hostname || hostname;
    port = parsedRpcconnect.port || port;
  }
  port = config.rpcport || port;
  const isIpv6 = hostname.split(':').length > 2;
  if (isIpv6) {
    hostname = `[${hostname}]`;
  }
  const url = new URL(`http://${hostname}:${port}`);

  // Determine username and password
  let username: string;
  let password: string;
  if (config.rpcpassword) {
    // cookie-based auth is disabled
    username = config.rpcuser || defaultConfig.rpcuser;
    password = config.rpcpassword;
  } else {
    // cookie-based auth is enabled
    const cookieFilePath = toAbsolute(
      config.rpccookiefile || defaultConfig.rpccookiefile,
      config.datadir,
      chainName,
    );
    let cookieFileContents: string;
    try {
      cookieFileContents = readFileSync(cookieFilePath, { encoding: 'utf8' });
    } catch (ex) {
      if (ex.code === 'ENOENT') {
        const message = `${ex.message}. Is bitcoind running?`;
        throw new CodedError(message, 'ENOENT');
      }
      throw ex;
    }
    [username, password] = cookieFileContents.split(':');
    if (!username || !password) {
      throw new Error('Expected cookie file to contain "username:password"');
    }
  }

  url.username = username;
  url.password = password;
  return url.href;
}
