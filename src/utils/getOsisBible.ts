import { OsisBible } from '../interfaces/osisBible';
import { xmlBible2Js } from './xmlBible2Js';

/**
 * Gets the osis bible from a osis xml bible path.
 * @param biblePath
 * @returns OsisBible from a file and error = true if there
 * was an error importing the bible
 */
export function getOsisBible(biblePath: string): ReturnValue {
  const returnValue = { osisBible: null, error: undefined };

  const result = xmlBible2Js(biblePath);

  // Handle xml import errors
  if (result.error) {
    returnValue.error = result.error;
    return returnValue;
  }

  // Handle invalid OSIS xml erros
  try {
    returnValue.osisBible = result.parsedBible.osis.osisText[0];
  } catch (error) {
    returnValue.error = error;
  }

  return returnValue;
}

interface ReturnValue {
  osisBible: OsisBible;
  error: Error;
}
