import { OsisBible } from 'src/interfaces/osisBible';
import { xmlBible2Js } from './xmlBible2Js';

/**
 * Gets the osis bible from a osis xml bible path.
 * @param biblePath
 * @returns OsisBible from a file and error = true if there
 * was an error importing the bible
 */
export function getOsisBible(biblePath: string): returnValue {
  let osisBible: OsisBible = { div: [{ chapter: [{ verse: [{ _: '' }] }] }] };
  let error = false;

  const result = xmlBible2Js(biblePath);
  if (result.error) return { osisBible, error: result.error };
  osisBible = result.parsedBible.osis.osisText[0];

  return { osisBible, error };
}

interface returnValue {
  osisBible: OsisBible;
  error: boolean;
}
