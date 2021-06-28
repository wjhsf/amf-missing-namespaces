export interface FindResult {
  path: string[];
  value: string;
}

function isMatch(target: string, value: string, prop: string): boolean {
  // toString() often returns a representation of the full internal state
  // It only seems helpful when the string starts with the target value
  if (prop === 'toString') return value.startsWith(target);
  return value.includes(target);
}

export function find(
  root: any,
  target: string,
  getProps: (obj: any) => string[],
): FindResult[] {
  const seen = new WeakSet();
  const results: FindResult[] = [];

  // Walk through the entire object and search for values containing the target
  (function walk(obj: any, path: string[]): void {
    if (seen.has(obj)) return;
    seen.add(obj);

    return getProps(obj).forEach((prop) => {
      const subpath = path.concat(prop);
      const value = typeof obj[prop] === 'function' ? obj[prop]() : obj[prop];

      if (typeof value === 'string' && isMatch(target, value, prop)) {
        results.push({ path: subpath, value });
      } else if (typeof value === 'object' && value !== null) {
        return walk(value, subpath);
      }
    });
  }(root, ['#']));

  return results;
}
