export interface BibleIndex {
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
