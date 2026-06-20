import * as fs from 'fs';
import { parseString as parseXmlString } from 'xml2js';

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null && 'code' in error;
}

export function xmlBible2Js(biblePath: string): ReturnValue {
  let returnValue: ReturnValue = {};
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

  parseXmlString(xmlFile, (error: unknown, result: unknown) => {
    if (error) {
      returnValue = { errorMessage: `Error opening the file "${biblePath}". Error Message:\n\n` + String(error) };

      return;
    }

    returnValue = { parsedBible: result };
  });

  return returnValue;
}

interface ReturnValue {
  parsedBible?: unknown;
  errorMessage?: string;
}
