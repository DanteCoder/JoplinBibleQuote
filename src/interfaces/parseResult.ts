import { OsisObject } from './osisObject';

export interface ParseResult {
  type: 'entities' | 'error' | 'help' | 'index';
  errorMessage?: string;
  entities?: Array<ParsedEntity>;
  bookId?: string;
}

export interface ParsedEntity {
  versions: Array<string>;
  osisObjects: Array<OsisObject>;
  options?: EntityOptions;
}

export interface EntityOptions {
  parallel?: boolean;
}
