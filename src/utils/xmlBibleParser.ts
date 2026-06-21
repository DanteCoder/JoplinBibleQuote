import * as fs from 'fs';

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null && 'code' in error;
}

function elementToObject(element: Element): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  const attrs: Record<string, string> = {};

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];

    if (attr.name.startsWith('xmlns')) continue;

    attrs[attr.name] = attr.value;
  }

  if (Object.keys(attrs).length > 0) {
    result.$ = attrs;
  }

  const childElements: Record<string, unknown[]> = {};
  let textContent = '';

  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];

    if (child.nodeType === 3) {
      textContent += child.nodeValue || '';
    } else if (child instanceof Element) {
      const el = child;
      const tag = el.tagName;

      if (!childElements[tag]) childElements[tag] = [];

      childElements[tag].push(elementToObject(el));
    }
  }

  for (const [tag, arr] of Object.entries(childElements)) {
    result[tag] = arr;
  }

  if (textContent && Object.keys(childElements).length === 0) {
    result._ = textContent;
  }

  return result;
}

export function xmlBibleParser(biblePath: string): ReturnValue {
  let xmlFile: string;

  try {
    xmlFile = fs.readFileSync(biblePath, 'utf8');
  } catch (error: unknown) {
    if (isNodeError(error)) {
      if (error.code === 'ENOENT') {
        return { errorMessage: `Invalid path "${biblePath}"` };
      }

      if (error.code === 'EISDIR') {
        return { errorMessage: 'There is no selected path for the default OSIS Bible' };
      }
    }

    return { errorMessage: String(error) };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlFile, 'text/xml');
  const root = doc.documentElement;

  if (root.tagName === 'parsererror' || root.querySelector('parsererror')) {
    return { errorMessage: `Error opening the file "${biblePath}". Error Message:\n\nFailed to parse XML` };
  }

  return { parsedBible: { [root.tagName]: elementToObject(root) } };
}

interface ReturnValue {
  parsedBible?: unknown;
  errorMessage?: string;
}
