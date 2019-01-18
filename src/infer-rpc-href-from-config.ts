import { URL } from 'url';
import { readFileSync } from 'fs';

import { BitcoinConfig, toAbsolute, getDefaultConfig } from '@carnesen/bitcoin-config';
import { getActiveChainName } from '@carnesen/bitcoin-config/lib/util';

function parseHost(str: string) {
  let hostname: string = str;
  let port: number | undefined;
  const indexOfLastColon = str.lastIndexOf(':');
  // if a : is found, and it either follows a [...], or no other : is in the string, treat it as port separator
  const hasColon = indexOfLastColon > -1;
  // if there is a colon and str[0]=='[', colon is not 0, so charAt(indexOfLastColon - 1) is safe
  const isBracketed =
    hasColon && str.startsWith('[') && str.charAt(indexOfLastColon - 1) === ']';
  const hasMultipleColons = hasColon && str.lastIndexOf(':', indexOfLastColon - 1) !== -1;
  if (hasColon && (indexOfLastColon === 0 || isBracketed || !hasMultipleColons)) {
    const portStr = str.slice(indexOfLastColon + 1);
    port = Number(portStr);
    if (isNaN(port) || port !== parseInt(portStr, 10)) {
      throw new Error(`Invalid port in host string "${str}"`);
    }
    hostname = str.slice(0, indexOfLastColon);
  }
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    hostname = hostname.slice(1, -1);
  }
  return {
    hostname,
    port,
  };
}

export function inferRpcHrefFromConfig(
  config: Pick<
    BitcoinConfig,
    | 'datadir'
    | 'regtest'
    | 'testnet'
    | 'rpccookiefile'
    | 'rpcconnect'
    | 'rpcpassword'
    | 'rpcuser'
    | 'rpcport'
  > = {},
) {
  const chainName = getActiveChainName(config);
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
    const cookieFileContents = readFileSync(cookieFilePath, { encoding: 'utf8' });
    [username, password] = cookieFileContents.split(':');
    if (!username || !password) {
      throw new Error('Expected cookie file to contain "username:password"');
    }
  }

  url.username = username;
  url.password = password;
  return url.href;
}
