export interface ParsedQuote {
  books: Array<Book>;
  cite: string;
}

interface Book {
  id: string;
  num: number;
  name: string;
  chapters: Array<Chapter>;
}

interface Chapter {
  id: number;
  verses: Array<number>;
}
