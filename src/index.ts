import path from 'path';
import { loadModel } from './loadModel';
import { find, FindResult } from './find';
import * as GETTERS from './getProps';

const target = process.argv[2];
if (!target) {
  console.log('Please specify a target (e.g. "Namespaced")')
  process.exit(1);
}

const getterName = process.argv[3];
if (!(getterName in GETTERS)) {
  console.log(`Please specify a getter (one of: ${Object.keys(GETTERS).join(', ')})`);
  process.exit(1);
}
const getProps = GETTERS[process.argv[3] as keyof typeof GETTERS];

const ramlFile = process.argv[4]
  ? path.resolve(process.argv[4]) 
  : path.join(__dirname, '../raml/main.raml');

loadModel(ramlFile)
  .then((model) => find(model, target, getProps))
  .then((found) => found.sort(sortResult).forEach(printResult))
  .catch(console.error);

function pathString(data: FindResult): string {
  return data.path.join('/');
}

function sortResult(a: FindResult, b: FindResult): number {
  const pathLengthDiff = a.path.length - b.path.length;
  if (pathLengthDiff !== 0) return pathLengthDiff;
  const aStr = pathString(a);
  const bStr = pathString(b);
  return aStr.localeCompare(bStr);
}

function printResult(data: FindResult): void {
  const path = pathString(data);
  // We don't care about the full contents of the RAML file
  const output = data.value.startsWith('#%RAML 1.0') ? '<RAML file>' : data.value;
  console.log(`${path} = ${output}`);
}
