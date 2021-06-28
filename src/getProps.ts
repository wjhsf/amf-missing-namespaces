import fs from 'fs';
import path from 'path';

// props.json contains object properties defined in AMF type definitions,
// including some getter methods (functions with no arguments)
const definedProps: string[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../props.json'), 'utf8'),
);

export function onlyDefinedProps(obj: Record<string, unknown>): string[] {
  if (Array.isArray(obj)) return Object.keys(obj);
  return definedProps.filter((prop) => prop in obj);
}

export function includeArtifacts(obj: Record <string, unknown>): string[] {
  if (Array.isArray(obj)) return Object.keys(obj);

  // Start with known properties
  const props = definedProps.filter((prop) => prop in obj);
  // Add build artifacts. They're inherently unknown, but are always
  // enumerable and are not functions
  for (const prop in obj) {
    if (typeof obj[prop] !== 'function' && !props.includes(prop)) {
      props.push(prop);
    }
  }

  return props;
}
