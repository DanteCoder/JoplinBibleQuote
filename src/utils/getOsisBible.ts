import { OsisBible } from '../interfaces/osisBible';
import { xmlBibleParser } from './xmlBibleParser';

interface XmlBibleResult {
  osis?: {
    osisText?: OsisBible[];
  };
}

function isXmlBibleResult(value: unknown): value is XmlBibleResult {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (!('osis' in obj)) return true;
  const osis = obj.osis;
  if (typeof osis !== 'object' || osis === null) return false;
  const osisObj = osis as Record<string, unknown>;
  if (!('osisText' in osisObj)) return true;
  return Array.isArray(osisObj.osisText);
}

export function getOsisBible(biblePath: string): ReturnValue {
  const result = xmlBibleParser(biblePath);

  if (result.errorMessage) {
    return { errorMessage: result.errorMessage };
  }

  const parsedBible = result.parsedBible;

  if (!isXmlBibleResult(parsedBible) || !parsedBible.osis?.osisText?.[0]) {
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
