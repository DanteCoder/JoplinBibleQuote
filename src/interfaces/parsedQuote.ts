export interface ParsedQuote {
  books: Array<Books>;
  cite: string;
}

interface Books {
  id: string;
  num: number;
  name: string;
  chapters: Array<Chapter>;
}

interface Chapter {
  id: number;
  verses: Array<number>;
}
