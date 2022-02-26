import { OsisBible } from '../interfaces/osisBible';
import { xmlBible2Js } from './xmlBible2Js';

/**
 * Gets the osis bible from a osis xml bible path.
 * @param biblePath
 * @returns OsisBible from a file and error = true if there
 * was an error importing the bible
 */
export function getOsisBible(biblePath: string): ReturnValue {
  const result = xmlBible2Js(biblePath);

  // Handle xml import errors
  if (result.errorMessage) {
    return { errorMessage: result.errorMessage };
  }

  // Handle invalid OSIS xml erros
  if (!result.parsedBible?.osis?.osisText?.[0]) {
    return {
      errorMessage: `Error importing the xml file "${biblePath}"\n Is the file a valid osis xml Bible?`,
    };
  }

  return { osisBible: result.parsedBible?.osis?.osisText?.[0] };
}

interface ReturnValue {
  osisBible?: OsisBible;
  errorMessage?: string;
}
