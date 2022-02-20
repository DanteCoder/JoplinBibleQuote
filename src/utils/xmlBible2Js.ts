import fs = require('fs');
import { parseString as parseXmlString } from 'xml2js';

/**
 * Parses an xml bible to a JS object
 * @param biblePath The path to the xml file
 * @returns Parsed xml bible or error
 */
export function xmlBible2Js(biblePath: string): returnValue {
  let parsedBible: any;
  let xmlFile: any;
  try {
    xmlFile = fs.readFileSync(biblePath, 'utf8');
  } catch (error) {
    return { parsedBible: null, error: error.message };
  }
  parseXmlString(xmlFile, (err, result) => {
    if (err) return { parsedBible: null, error: err.message };
    parsedBible = result;
  });

  return { parsedBible, error: false };
}

interface returnValue {
  parsedBible: any;
  error: any;
}
