import * as fs from 'fs';
import * as path from 'path';
import { OsisBible } from '../interfaces/osisBible';
import { getOsisBible } from './getOsisBible';

export function getOsisBibles(biblesPath: string): Array<OsisBible> {
  const osisBibles: OsisBible[] = [];

  let files = fs.readdirSync(biblesPath, {
    withFileTypes: true,
  });

  files = files.filter(file => file.name.match(/.xml$/));

  for (const file of files) {
    const result = getOsisBible(path.join(biblesPath, file.name));

    if (result.errorMessage) continue;
    if (!result.osisBible) continue;

    osisBibles.push(result.osisBible);
  }

  return osisBibles;
}
