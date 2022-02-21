import fs = require('fs');
import path = require('path');
import { OsisBible } from '../interfaces/osisBible';
import { getOsisBible } from './getOsisBible';

/**
 * Imports xml osis Bibles from a folder path
 * @param biblesPath
 * @returns An array of OSIS Bibles
 */
export function getOsisBibles(biblesPath: string): Array<OsisBible> {
  const osisBibles = [];

  let files = fs.readdirSync(biblesPath, {
    withFileTypes: true,
  });

  // Filter only xml files
  files = files.filter((file) => file.name.match(/.xml$/));

  // Try to open the Bible files
  for (const file of files) {
    const result = getOsisBible(path.join(biblesPath, file.name));
    if (result.error) continue;
    osisBibles.push(result.osisBible);
  }

  return osisBibles;
}
