import { dirname, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { URL } from 'url';

import {
  BITCOIN_CONFIG_OPTIONS,
  BitcoinConfig,
  writeConfigFile,
} from '@carnesen/bitcoin-config';
import tempWrite = require('temp-write');
import * as tempy from 'tempy';

import { readRpcHref as subject } from '../read-rpc-href';

function testSubject(config: BitcoinConfig) {
  const configFilePath = tempy.file();
  writeConfigFile(configFilePath, config);
  return subject(configFilePath);
}

describe(subject.name, () => {
  it('returns href with passed username and password', () => {
    const url = new URL(testSubject({ rpcuser: 'carnesen', rpcpassword: '12345678' }));
    expect(url.username).toBe('carnesen');
    expect(url.password).toBe('12345678');
  });

  it('returns href with passed password and default rpcuser', () => {
    const url = new URL(testSubject({ rpcpassword: '12345678' }));
    expect(url.password).toBe('12345678');
    expect(url.username).toBe(BITCOIN_CONFIG_OPTIONS.rpcuser.defaultValue);
  });

  it('takes port from (in order) config.rpcport || config.rpcconnect || defaultConfig.rpcport', () => {
    const config = { rpcpassword: 'x', rpcport: 1111, rpcconnect: ':2222' };
    expect(new URL(testSubject(config)).port).toBe('1111');
    delete config.rpcport;
    expect(new URL(testSubject(config)).port).toBe('2222');
    delete config.rpcconnect;
    expect(new URL(testSubject(config)).port).toBe('8332');
  });

  it('takes hostname from (in order) config.rpcconnect || defaultConfig.rpcport', () => {
    const config = { rpcpassword: 'x', rpcconnect: '1.2.3.4:2222' };
    expect(new URL(testSubject(config)).hostname).toBe('1.2.3.4');
    delete config.rpcconnect;
    expect(new URL(testSubject(config)).hostname).toBe('127.0.0.1');
  });

  it('properly constructs an []-wrapped hostname href from an ipv6 address', () => {
    const config = { rpcpassword: 'x', rpcconnect: '[::1]:2222' };
    expect(new URL(testSubject(config)).hostname).toBe('[::1]');
  });

  it('properly constructs an un-[]-wrapped hostname from a wrapped hostname', () => {
    const config = { rpcpassword: 'x', rpcconnect: '[www.carnesen.com]' };
    expect(new URL(testSubject(config)).hostname).toBe('www.carnesen.com');
  });

  it('reads cookie file from top datadir when chainName is "main"', () => {
    const cookieFilePath = tempWrite.sync('foo:bar', '.cookie');
    const config = { datadir: dirname(cookieFilePath) };
    const url = new URL(testSubject(config));
    expect(url.username).toBe('foo');
    expect(url.password).toBe('bar');
  });

  it('reads cookie from datadir-relative rpccookiefile', () => {
    const cookieFilePath = tempWrite.sync('foo:bar', 'not.cookie');
    const config = { datadir: dirname(cookieFilePath), rpccookiefile: 'not.cookie' };
    const url = new URL(testSubject(config));
    expect(url.username).toBe('foo');
    expect(url.password).toBe('bar');
  });

  it('reads cookie from absolute rpccookiefile', () => {
    const cookieFilePath = tempWrite.sync('foo:bar');
    const config = { rpccookiefile: cookieFilePath };
    const url = new URL(testSubject(config));
    expect(url.username).toBe('foo');
    expect(url.password).toBe('bar');
  });

  it('reads cookie file from testnet3 datasubdir when testnet is true', () => {
    const datadir = tempy.directory();
    const subDatadir = join(datadir, 'testnet3');
    mkdirSync(subDatadir);
    writeFileSync(join(subDatadir, '.cookie'), 'foo:bar');
    const config = { datadir, testnet: true };
    const url = new URL(testSubject(config));
    expect(url.username).toBe('foo');
    expect(url.password).toBe('bar');
  });

  it('reads cookie file from regtest datasubdir when regtest is true', () => {
    const datadir = tempy.directory();
    const subDatadir = join(datadir, 'regtest');
    mkdirSync(subDatadir);
    writeFileSync(join(subDatadir, '.cookie'), 'foo:bar');
    const config = { datadir, regtest: true };
    const url = new URL(testSubject(config));
    expect(url.username).toBe('foo');
    expect(url.password).toBe('bar');
  });

  it('re-throws an error encountered reading the cookie file', () => {
    const rpccookiefile = tempy.file();
    writeFileSync(rpccookiefile, 'foo:bar', { encoding: 'utf8', mode: '000' });
    const config = { rpccookiefile };
    expect(() => {
      testSubject(config);
    }).toThrow('EACCES');
  });

  it('throws "invalid port" if port in rpcconnect is not a number', () => {
    expect(() => {
      testSubject({ rpcconnect: '1.2.3.4:foo' });
    }).toThrow('Invalid port');
  });

  it('throws "Is bitcoind running?" if there is no cookie file', () => {
    expect(() => {
      testSubject({});
    }).toThrow('Is bitcoind running?');
  });

  it('throws "username:password" if cookie file does not have expected format', () => {
    const rpccookiefile = tempWrite.sync('foo bar baz');
    expect(() => {
      testSubject({ rpccookiefile });
    }).toThrow('username:password');
  });
});
