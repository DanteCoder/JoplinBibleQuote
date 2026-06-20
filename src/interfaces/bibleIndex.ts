export interface BibleIndex {
  [key: string]: BibleLanguage;
  en: BibleLanguage;
  es: BibleLanguage;
  fr: BibleLanguage;
  zh: BibleLanguage;
}

export interface BibleLanguage {
  book: string;
  books: Array<string>;
  chapter: string;
  chapters: string;
  verses: string;
}

export interface BibleInfo {
  books: string[];
  chapters: Record<string, number[]>;
  order: Record<string, number>;
}
