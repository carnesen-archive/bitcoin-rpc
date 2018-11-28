import { readFile, writeFile, readdir } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { execFile } from 'child_process';
import { ensureDir, pathExists } from 'fs-extra';
import isEqual = require('lodash.isequal');
import camelCase = require('lodash.camelcase');
import upperFirst = require('lodash.upperfirst');
import findVersions = require('find-versions');
import { readBitcoinConfSync, readBitcoinRpcHrefSync, isEnabled } from './configuration';
import { JsonRpcClient, JsonRpcParams, JsonRpcRequest, JsonRpcResult } from './json-rpc';
import { parse } from 'semver';

const generatedDir = join(__dirname, 'generated');

type Example = {
  subversion: string;
  request: JsonRpcRequest;
  result: JsonRpcResult;
};

type ImplementationName = 'abc' | 'core';
type Implementation = {
  name: ImplementationName;
  version: string;
};
const parseSubversion = (subversion: string) => {
  const regexpString = '^/(.*):(.*)/$';
  const matches = subversion.match(regexpString);
  if (!matches) {
    throw new Error(`Expected subversion "${subversion}" to match ${regexpString}`);
  }
  const [, nameMatch, versionMatch] = matches;
  let name: ImplementationName;
  switch (nameMatch) {
    case 'Satoshi':
      name = 'core';
      break;
    case 'Bitcoin ABC':
      name = 'abc';
      break;
    default:
      throw new Error(`Unknown implementation "${nameMatch}"`);
  }
  const versionStrings = findVersions(versionMatch, { loose: true });
  if (versionStrings.length !== 1) {
    throw new Error(`Unexpected version string "${versionMatch}"`);
  }
  const versionString = versionStrings[0];
  const version = parse(versionString);
  if (!version) {
    throw new Error('Failed to parse found version string');
  }
  const implementation: Implementation = {
    name,
    version: `v${version.major}.${version.minor}`,
  };
  return implementation;
};

const isEqualRequest = (r1: JsonRpcRequest, r2: JsonRpcRequest) => {
  return isEqual(r1.params, r2.params) && r1.method === r2.method;
};

const isEqualImplementation = (i1: Implementation, i2: Implementation) => isEqual(i1, i2);

const pascalCase = (str: string) => upperFirst(camelCase(str));

const doNotEditWarning = '// This file is generated programmatically. Do not edit.';

const fix = async (filePath: string) => {
  await promisify(execFile)('tslint', ['--fix', filePath]);
};

const getMethodDir = (implementation: Implementation, methodId: string) =>
  join(generatedDir, implementation.name, implementation.version, methodId);

const readExamplesJson = async (dir: string) => {
  const examplesFilePath = join(dir, 'examples.json');
  let examples: Example[] = [];
  try {
    const examplesFileContents = await promisify(readFile)(examplesFilePath, {
      encoding: 'utf8',
    });
    examples = JSON.parse(examplesFileContents);
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      throw ex;
    }
  }
  return examples;
};

const writeExamplesJson = async (dir: string, examples: Example[]) => {
  const examplesFilePath = join(dir, 'examples.json');
  await ensureDir(dir);
  await promisify(writeFile)(examplesFilePath, JSON.stringify(examples, null, 2));
};

const writeIndexTs = async (dir: string) => {
  const examplesFilePath = join(dir, 'examples.json');
  const { stdout: quicktypeOutput } = await promisify(execFile)('quicktype', [
    '--src',
    examplesFilePath,
    '--src-lang',
    'json',
    '--lang',
    'ts',
    '--just-types',
  ]);
  const transformedQuicktypeOutput = quicktypeOutput
    .replace(/export interface (.*) {/g, 'export type $1 = {')
    .replace(/Examples/g, 'Example');
  const indexFileContents = [
    doNotEditWarning,
    '',
    "import * as examplesJson from './examples.json';",
    'export const examples: Example[] = examplesJson;',
    '',
    transformedQuicktypeOutput,
  ].join('\n');
  const indexFilePath = join(dir, 'index.ts');
  await promisify(writeFile)(indexFilePath, indexFileContents);
  await fix(indexFilePath);
};

class DevClient {
  private readonly jsonRpcClient: JsonRpcClient;
  constructor() {
    const { regtest } = readBitcoinConfSync();
    if (!isEnabled(regtest)) {
      throw new Error('Bitcoin server must be running in "regtest" mode');
    }
    const href = readBitcoinRpcHrefSync();
    this.jsonRpcClient = new JsonRpcClient(href);
  }

  public async upsertExample(dirName: string, request: JsonRpcRequest) {
    const { subversion } = await this.jsonRpcClient.rpc('getnetworkinfo');
    const server: Implementation = {
      subversion,
    };
    const examples = await readExamplesJson(dirName);
    const existingExample = examples.find(
      example =>
        isEqualImplementation(server, example.implementation) &&
        isEqualRequest(request, example.request),
    );
    if (!existingExample) {
      const result = await this.jsonRpcClient.sendRequest(request);
      examples.push({
        implementation,
        request,
        result,
      });
    }
    await writeExamplesJson(dirName, examples);
  }

  public async bootstrap(kebabCasedMethod: string, params?: JsonRpcParams) {
    const pascalCasedMethod = pascalCase(kebabCasedMethod);
    const method = pascalCasedMethod.toLowerCase();
    let verbosityString: string = '';
    if (params) {
      const { verbose, verbosity } = params;
      if (typeof verbose === 'number') {
        verbosityString = verbose.toString();
      } else if (typeof verbosity === 'number') {
        verbosityString = verbosity.toString();
      }
    }
    let dirName = kebabCasedMethod;
    if (verbosityString) {
      dirName += `-${verbosityString}`;
    }
    await this.upsertExample(dirName, {
      method,
      params: isEqual(params, {}) ? undefined : params,
    });
  }
  public async updateAll() {
    const fileNames = await readdir(generatedDir);
    const dirNames = fileNames.filter(fileName => fileName !== 'index.ts');
    for (const dirName of dirNames) {
      const examples = await readExamplesJson(dirName);
      for (const example of examples) {
        await this.upsertExample(dirName, example.request);
      }
    }
    const indexFileItems = dirNames.map(dirName => {
      const pascalCasedDirName = pascalCase(dirName);
      const importString = `import * as ${pascalCasedDirName} from "./${dirName}";`;
      const exportString = `export { ${pascalCasedDirName} };`;
      return `${importString}\n${exportString}`;
    });
    const indexFileContents = `${doNotEditWarning}\n\n${indexFileItems.join('\n')}\n`;
    const indexFilePath = join(generatedDir, 'index.ts');
    await writeFile(indexFilePath, indexFileContents);
    await fix(indexFilePath);
  }
}

const runAndExit = async (func: () => Promise<void>) => {
  try {
    await func();
    process.exit(0);
  } catch (ex) {
    setImmediate(() => {
      throw ex;
    });
  }
};

if (require.main === module) {
  runAndExit(async () => {
    const client = new DevClient();
    // await client.bootstrap('get-blockchain-info', {});
    await client.updateAll();
  });
}
