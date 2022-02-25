export interface ParseResult {
  type: 'entities' | 'error' | 'help';
  errorMessage?: string;
  entities?: Array<ParsedEntity>;
}

export interface ParsedEntity {
  versions: Array<string>;
  osisObjects: Array<any>;
  options?: EntityOptions;
}

export interface EntityOptions {
  parallel?: boolean;
}
