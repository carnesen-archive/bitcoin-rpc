import { readFile, writeFile, readdir } from 'fs';
import { join, resolve, dirname } from 'path';
import { promisify } from 'util';
import { execFile } from 'child_process';
import { ensureDir } from 'fs-extra';
import isEqual = require('lodash.isequal');
import camelCase = require('lodash.camelcase');
import upperFirst = require('lodash.upperfirst');
import uniqWith = require('lodash.uniqwith');
import findVersions = require('find-versions');
import { readBitcoinConfSync, readBitcoinRpcHrefSync, isEnabled } from './configuration';
import {
  JsonRpcClient,
  JsonRpcParams,
  JsonRpcRequest,
  JsonRpcResponse,
} from './json-rpc';
import { parse } from 'semver';

const TOP_DIR = resolve(__dirname, '..');
const EXAMPLES_DIR = join(TOP_DIR, 'examples');
const TMP_DIR = join(TOP_DIR, 'tmp');
const GENERATED_DIR = join(TOP_DIR, 'src', 'generated');

type MethodId = {
  methodName: string;
  implementationName: 'abc' | 'core';
  implementationVersion: string;
};

type Example = {
  methodId: MethodId;
  info: {
    subversion: string;
  };
  request: JsonRpcRequest;
  response: JsonRpcResponse;
};

const parseSubversion = (subversion: string) => {
  const regexpString = '^/(.*):(.*)/$';
  const matches = subversion.match(regexpString);
  if (!matches) {
    throw new Error(`Expected subversion "${subversion}" to match ${regexpString}`);
  }
  const [, nameMatch, versionMatch] = matches;
  let implementationName: MethodId['implementationName'];
  switch (nameMatch) {
    case 'Satoshi':
      implementationName = 'core';
      break;
    case 'Bitcoin ABC':
      implementationName = 'abc';
      break;
    default:
      throw new Error(`Unknown implementation "${nameMatch}"`);
  }
  const semverVersionStrings = findVersions(versionMatch);
  if (semverVersionStrings.length !== 1) {
    throw new Error(`Unexpected version string "${versionMatch}"`);
  }
  const semverVersionString = semverVersionStrings[0];
  const semver = parse(semverVersionString);
  if (!semver) {
    throw new Error('Failed to parse found version string');
  }
  return {
    implementationName,
    implementationVersion: `v${semver.major}-${semver.minor}`,
  };
};

const pascalCase = (str: string) => upperFirst(camelCase(str));
const methodCase = (str: string) => camelCase(str).toLowerCase();

const writeTsFile = async (filePath: string, fileContents: string) => {
  await ensureDir(dirname(filePath));
  await promisify(writeFile)(
    filePath,
    `// This file is generated programmatically. Do not edit.\n\n${fileContents}`,
  );
  await promisify(execFile)('tslint', ['--fix', filePath]);
};

const writeJsonFile = async (filePath: string, contents: any) => {
  await ensureDir(dirname(filePath));
  await promisify(writeFile)(filePath, JSON.stringify(contents, null, 2));
};

const readJsonFile = async (filePath: string) => {
  const fileContents = await promisify(readFile)(filePath, {
    encoding: 'utf8',
  });
  return JSON.parse(fileContents);
};

const getMethodExamplesFilePath = (methodId: MethodId) => {
  const { methodName, implementationName, implementationVersion } = methodId;
  const methodDir = join(EXAMPLES_DIR, methodName);
  const fileName = `${implementationName}-${implementationVersion}.json`;
  return join(methodDir, fileName);
};

const readMethodExamples = async (methodId: MethodId) => {
  const examplesJsonPath = getMethodExamplesFilePath(methodId);
  let examples: Example[] = [];
  try {
    examples = await readJsonFile(examplesJsonPath);
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      throw ex;
    }
  }
  return examples;
};

const readAllExamples = async () => {
  const methodNames = await promisify(readdir)(EXAMPLES_DIR);
  const allExamples: Example[] = [];
  for (const methodName of methodNames) {
    const methodDir = join(EXAMPLES_DIR, methodName);
    const fileNames = await promisify(readdir)(methodDir);
    for (const fileName of fileNames) {
      const filePath = join(methodDir, fileName);
      const examples = await readJsonFile(filePath);
      allExamples.push(...examples);
    }
  }
  return allExamples;
};

const writeMethodExamples = async (methodId: MethodId, examples: Example[]) => {
  const examplesJsonPath = getMethodExamplesFilePath(methodId);
  await writeJsonFile(examplesJsonPath, examples);
};

const writeMethodIndexTs = async (methodId: MethodId) => {
  const examples = await readMethodExamples(methodId);
  const successExamples = examples.filter(example => !example.response.error);
  const hasParams = !successExamples.every(example => !example.request.params);
  const paredExamples = successExamples.map(example => {
    return {
      params: example.request.params,
      result: example.response.result,
    };
  });

  const { methodName, implementationName, implementationVersion } = methodId;
  const tmpJsonFilePath = join(
    TMP_DIR,
    `${methodName}-${implementationName}-${implementationVersion}.json`,
  );
  await ensureDir(dirname(tmpJsonFilePath));
  await promisify(writeFile)(tmpJsonFilePath, JSON.stringify(paredExamples, null, 2));
  const pascalCasedMethodName = pascalCase(methodId.methodName);
  const { stdout: quicktypeOutput } = await promisify(execFile)('quicktype', [
    '--src',
    tmpJsonFilePath,
    '--src-lang',
    'json',
    '--lang',
    'ts',
    '--just-types',
    '--top-level',
    pascalCasedMethodName,
  ]);
  let fileContents = quicktypeOutput
    .replace(/export interface (.*) {/g, 'type $1 = {')
    .replace(/verbosity: number;/g, '// Note: verbosity has special handling')
    .replace(/verbose: number;/g, '// Note: verbose has special handling');
  fileContents += `
    export type ${pascalCasedMethodName}Result = ${pascalCasedMethodName}['result'];`;
  if (hasParams) {
    fileContents += `
      export type ${pascalCasedMethodName}Params = ${pascalCasedMethodName}['params'];`;
  }
  const indexFilePath = join(TMP_DIR, 'index.ts');
  await writeTsFile(indexFilePath, fileContents);
};

const writeImplementationIndexTs = async (implementationDir: string) => {
  const dirNames = await promisify(readdir)(implementationDir);
  const methodDirNames = dirNames.filter(fileName => fileName !== 'index.ts');
  const indexFileItems = methodDirNames.map(methodDirName => {
    const pascalCasedDirName = pascalCase(methodDirName);
    const importString = `import * as ${pascalCasedDirName} from "./${methodDirName}";`;
    const exportString = `export { ${pascalCasedDirName} };`;
    return `${importString}\n${exportString}`;
  });
  const indexFileContents = `${indexFileItems.join('\n')}\n`;
  const indexFilePath = join(implementationDir, 'index.ts');
  await writeTsFile(indexFilePath, indexFileContents);
};

const { regtest } = readBitcoinConfSync();
if (!isEnabled(regtest)) {
  throw new Error('Bitcoin server software must be running in "regtest" mode');
}
const href = readBitcoinRpcHrefSync();
const jsonRpcClient = new JsonRpcClient(href);

const upsertExample = async (methodName: string, params?: JsonRpcParams) => {
  const response = await jsonRpcClient.sendRequest({
    method: 'getnetworkinfo',
  });
  if (response.error) {
    throw new Error(response.error.message);
  }
  const { subversion } = response.result;
  const implementation = parseSubversion(subversion);
  const methodId: MethodId = { methodName, ...implementation };
  const examples = await readMethodExamples(methodId);
  const existingExample = examples.find(example =>
    isEqual(example.request.params, params),
  );
  if (!existingExample) {
    const request: JsonRpcRequest = {
      method: methodCase(methodName),
      params,
    };
    const response = await jsonRpcClient.sendRequest(request);
    examples.push({
      methodId,
      info: {
        subversion,
      },
      request,
      response,
    });
    await writeMethodExamples(methodId, examples);
  }
};

const upsertAllExamples = async () => {
  const allExamples = await readAllExamples();
  const argObjects = uniqWith(
    allExamples.map(
      example => ({
        methodName: example.methodId.methodName,
        params: example.request.params,
      }),
      isEqual,
    ),
  );
  for (const argObject of argObjects) {
    await upsertExample(argObject.methodName, argObject.params);
  }
};

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
    // await readAllExamples();
    await upsertAllExamples();
    // await upsertExample('get-block-hash', {
    //   height: 0,
    // });
    // await writeMethodIndexTs({
    //   methodName: 'get-block-hash',
    //   implementationName: 'abc',
    //   implementationVersion: 'v0-18',
    // });
  });
}
