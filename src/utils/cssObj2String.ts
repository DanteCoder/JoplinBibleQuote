/**
 * Creates a css string from a css object
 * @param cssObject
 * @returns css string
 */
export function cssObj2String(cssObject: any): string {
  let cssString = '';
  for (const key in cssObject) {
    const property = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssString += `${property}: ${cssObject[key]};`;
  }
  return cssString;
}
