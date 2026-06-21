import { OsisBible } from '../interfaces/osisBible';
import { xmlBibleParser } from './xmlBibleParser';

interface XmlBibleResult {
  osis?: {
    osisText?: OsisBible[];
  };
}

export function getOsisBible(biblePath: string): ReturnValue {
  const result = xmlBibleParser(biblePath);

  if (result.errorMessage) {
    return { errorMessage: result.errorMessage };
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const parsedBible = result.parsedBible as XmlBibleResult | undefined;

  if (!parsedBible?.osis?.osisText?.[0]) {
    return {
      errorMessage: `Error importing the xml file "${biblePath}"\n Is the file a valid osis xml Bible?`,
    };
  }

  return { osisBible: parsedBible.osis.osisText[0] };
}

interface ReturnValue {
  osisBible?: OsisBible;
  errorMessage?: string;
}
