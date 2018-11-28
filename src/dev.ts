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

type Example = {
  params?: JsonRpcParams;
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
  const versionStrings = findVersions(versionMatch);
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
    version: `v${version.major}-${version.minor}`,
  };
  return implementation;
};

const pascalCase = (str: string) => upperFirst(camelCase(str));

const doNotEditWarning = '// This file is generated programmatically. Do not edit.';

const fix = async (filePath: string) => {
  await promisify(execFile)('tslint', ['--fix', filePath]);
};

const methodCase = (str: string) => camelCase(str).toLowerCase();

const getDir = (
  implementation: Implementation,
  kebabCasedMethod: string,
  params?: JsonRpcParams,
) => {
  const method = methodCase(kebabCasedMethod);
  let verbosityString: string = '';
  if (params) {
    const { verbose, verbosity } = params;
    if (typeof verbose === 'number') {
      verbosityString = verbose.toString();
    } else if (typeof verbosity === 'number') {
      verbosityString = verbosity.toString();
    }
  }
  let dirName = method;
  if (verbosityString) {
    dirName += `-${verbosityString}`;
  }
  return join(
    __dirname,
    'generated',
    implementation.name,
    implementation.version,
    dirName,
  );
};

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
      throw new Error('Bitcoin server software must be running in "regtest" mode');
    }
    const href = readBitcoinRpcHrefSync();
    this.jsonRpcClient = new JsonRpcClient(href);
  }

  public async upsertExample(kebabCasedMethod: string, params?: JsonRpcParams) {
    const { subversion } = await this.jsonRpcClient.rpc('getnetworkinfo');
    const implementation = parseSubversion(subversion);
    const dir = getDir(implementation, kebabCasedMethod, params);
    const examples = await readExamplesJson(dir);
    const existingExample = examples.find(example => isEqual(example.params, params));
    if (!existingExample) {
      const result = await this.jsonRpcClient.rpc(methodCase(kebabCasedMethod), params);
      examples.push({
        params,
        result,
      });
      await writeExamplesJson(dir, examples);
      await writeIndexTs(dir);
    }
  }

  // public async updateAll() {
  //   const fileNames = await readdir(__dirname);
  //   const dirNames = fileNames.filter(fileName => fileName !== 'index.ts');
  //   for (const dirName of dirNames) {
  //     const examples = await readExamplesJson(dirName);
  //     for (const example of examples) {
  //       await this.upsertExample(dirName, example.request);
  //     }
  //   }
  //   const indexFileItems = dirNames.map(dirName => {
  //     const pascalCasedDirName = pascalCase(dirName);
  //     const importString = `import * as ${pascalCasedDirName} from "./${dirName}";`;
  //     const exportString = `export { ${pascalCasedDirName} };`;
  //     return `${importString}\n${exportString}`;
  //   });
  //   const indexFileContents = `${doNotEditWarning}\n\n${indexFileItems.join('\n')}\n`;
  //   const indexFilePath = join(__dirname, 'index.ts');
  //   await writeFile(indexFilePath, indexFileContents);
  //   await fix(indexFilePath);
  // }
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
    await client.upsertExample('get-block', { verbosity: 1 });
  });
}
