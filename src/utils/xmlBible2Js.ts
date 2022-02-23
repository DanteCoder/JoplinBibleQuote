import fs = require('fs');
import { OsisBible } from 'src/interfaces/osisBible';
import { parseString as parseXmlString } from 'xml2js';

/**
 * Parses an xml bible to a JS object
 * @param biblePath The path to the xml file
 * @returns Parsed xml bible and error
 */
export function xmlBible2Js(biblePath: string): ReturnValue {
  let returnValue: ReturnValue;
  let xmlFile: any;
  try {
    xmlFile = fs.readFileSync(biblePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { errorMessage: `Invalid path "${biblePath}"` };
    }
    if (error.code === 'EISDIR') {
      return { errorMessage: 'There is no selected path for the default OSIS Bible' };
    }
  }
  parseXmlString(xmlFile, (error: any, result: any) => {
    if (error) {
      returnValue = { errorMessage: `Error opening the file "${biblePath}". Error Message:\n\n` + String(error) };
      return;
    }
    returnValue = { parsedBible: result };
  });

  return returnValue;
}

interface ReturnValue {
  parsedBible?: any;
  errorMessage?: string;
}
