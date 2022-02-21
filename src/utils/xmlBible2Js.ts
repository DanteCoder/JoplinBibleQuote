import fs = require('fs');
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
    return { parsedBible: null, error };
  }
  parseXmlString(xmlFile, (error: Error, result: any) => {
    returnValue = { parsedBible: result, error };
  });

  return returnValue;
}

interface ReturnValue {
  parsedBible: any;
  error: Error;
}
