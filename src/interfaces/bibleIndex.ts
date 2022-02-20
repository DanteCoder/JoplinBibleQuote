export interface BibleIndex {
  en: BibleLanguage;
  es: BibleLanguage;
  fr: BibleLanguage;
}

export interface BibleLanguage {
  chapterTitle: string;
  books: Array<string>;
}
