import { StyleProps } from '../interfaces/style';

export function cssObj2String(cssObject: StyleProps): string {
  let cssString = '';

  for (const key in cssObject) {
    const property = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssString += `${property}: ${cssObject[key]};`;
  }

  return cssString;
}
