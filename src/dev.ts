import { ensureDir, writeFile, readFile, appendFile } from 'fs-extra';
import { join } from 'path';
import { readBitcoinConfSync, readBitcoinRpcHrefSync } from './configuration';
import { JsonRpcClient } from './json-rpc';

const bitcoinConf = readBitcoinConfSync();
if (bitcoinConf.rpcpassword) {
  bitcoinConf.rpcpassword = 'xxxxxxx';
}

const href = readBitcoinRpcHrefSync();
const jsonRpcClient = new JsonRpcClient(href);

const getMeta = async () => {
  const { response } = await sendRequest('getnetworkinfo');
  const { result } = response;
  const { version, subversion, protocolversion } = result;
  return {
    timestamp: Date.now(),
    clientInfo: {
      version: pkg.version,
    },
    networkInfo: {
      version,
      subversion,
      protocolversion,
    },
  };
};

const examplesDir = join(__dirname, 'examples');

const getExample = async (method: string, params?: unknown) => {
  const meta = await getMeta();
  const { request, response } = await sendRequest(method, params);
  const methodDir = join(examplesDir, method);
  await ensureDir(methodDir);
  const exampleName = `example_${meta.timestamp}`;
  const fileName = `${exampleName}.json`;
  const fileContents = JSON.stringify({ meta, request, response }, null, 2);
  await writeFile(join(methodDir, fileName), fileContents);
  const indexFilePath = join(__dirname, 'index.ts');
  const indexFileCode = `
import * as ${exampleName} from './examples/${method}/${fileName}';
export { ${exampleName} };
`;
  await appendFile(indexFilePath, indexFileCode);
};

(async () => {
  try {
    await getExample('getnetworkinfo');
    debugger;
    process.exit(0);
  } catch (ex) {
    setTimeout(() => {
      throw ex;
    }, 0);
  }
})();
