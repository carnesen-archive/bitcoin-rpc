import { isAbsolute, join, resolve } from 'path';
import { platform } from 'os';
import { decode } from 'ini';
import { readFileSync } from 'fs';
import expandTilde = require('expand-tilde');
import { URL } from 'url';

type Flag = '0' | '1';
export const isEnabled = (flag?: Flag) => flag === '1';

export type BitcoinConf = Partial<{
  rpcuser: string;
  rpcpassword: string;
  rpcport: string;
  rpccookiefile: string;
  testnet: Flag;
  regtest: Flag;
  datadir: string;
}>;

let defaultDatadir: string;
switch (platform()) {
  case 'darwin':
    defaultDatadir = '~/Library/Application Support/Bitcoin/';
    break;
  case 'win32':
    defaultDatadir = resolve(process.env.APPDATA || '', 'Bitcoin');
    break;
  default:
    defaultDatadir = '~/.bitcoin';
}

export const readBitcoinConfSync = (
  options: {
    conf?: string;
    datadir?: string;
  } = {},
) => {
  const { conf = 'bitcoin.conf', datadir = defaultDatadir } = options;
  const expandedDatadir = expandTilde(datadir);
  const expandedConf = expandTilde(conf);
  let confFilePath: string;
  if (isAbsolute(expandedConf)) {
    // In this case datadir is ignored
    confFilePath = expandedConf;
  } else {
    // conf is present as a datadir-relative path
    confFilePath = join(expandedDatadir, conf);
  }
  let confFileContents: string = '';
  try {
    confFileContents = readFileSync(confFilePath, { encoding: 'utf8' });
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      throw ex;
    }
  }
  const bitcoinConf: BitcoinConf = decode(confFileContents);
  return bitcoinConf;
};

export const readBitcoinRpcHrefSync = (
  options: {
    conf?: string;
    datadir?: string;
  } = {},
) => {
  const loadedConfiguration = readBitcoinConfSync(options);
  const url = new URL('http://localhost/');
  const { rpcuser, rpcpassword } = loadedConfiguration;
  if (rpcpassword) {
    // cookie-based auth is disabled
    if (!rpcuser) {
      throw new Error('Configuration file had rpcpassword but not rpcuser');
    }
    url.username = rpcuser;
    url.password = rpcpassword;
  } else {
    // cookie-based auth is enabled
    const { rpccookiefile = '.cookie' } = loadedConfiguration;
    let cookieFilePath: string;
    if (isAbsolute(rpccookiefile)) {
      cookieFilePath = rpccookiefile;
    } else {
      // rpccookiefile is a relative path
      let resolvedDatadir: string;
      if (options.datadir) {
        // passed datadir takes precedence
        resolvedDatadir = resolve(expandTilde(options.datadir));
      } else if (loadedConfiguration.datadir) {
        // tildes in loaded configuration are not expanded
        resolvedDatadir = resolve(loadedConfiguration.datadir);
      } else {
        resolvedDatadir = resolve(expandTilde(defaultDatadir));
      }
      const { regtest, testnet } = loadedConfiguration;
      let cookieDir: string;
      if (regtest) {
        cookieDir = join(resolvedDatadir, 'regtest');
      } else if (testnet) {
        cookieDir = join(resolvedDatadir, 'testnet3');
      } else {
        cookieDir = resolvedDatadir;
      }
      cookieFilePath = join(cookieDir, rpccookiefile);
      let cookieFileContents: string;
      try {
        cookieFileContents = readFileSync(cookieFilePath, { encoding: 'utf8' });
      } catch (ex) {
        if (ex.code === 'ENOENT') {
          throw new Error(`Expected to find "${cookieFilePath}". Is bitcoind running?`);
        } else {
          throw ex;
        }
      }
      const [username, password] = cookieFileContents.split(':');
      if (!username || !password) {
        throw new Error('Expected cookie file to contain "username:password"');
      }
      url.username = username;
      url.password = password;
    }
  }
  const { rpcport, regtest, testnet } = loadedConfiguration;
  let resolvedPort: string;
  if (rpcport) {
    resolvedPort = rpcport;
  } else if (isEnabled(regtest)) {
    resolvedPort = '18443';
  } else if (isEnabled(testnet)) {
    resolvedPort = '18332';
  } else {
    resolvedPort = '8332';
  }
  url.port = resolvedPort;
  return url.href;
};
