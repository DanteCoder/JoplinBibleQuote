import { BibleInfo, BibleLanguage } from 'src/interfaces/bibleIndex';
import { OsisObject } from 'src/interfaces/osisObject';
import { ParsedQuote } from 'src/interfaces/parsedQuote';
import { osis2Cite } from './osis2Cite';

export function parseQuote(osisObject: OsisObject, bibleIndex: BibleLanguage, bibleInfo: BibleInfo): ParsedQuote {
  const parsedQuote: ParsedQuote = { books: [], cite: osis2Cite(osisObject, bibleIndex, bibleInfo) };

  for (const entity of osisObject.entities) {
    const startBcv = entity.start;
    const endBcv = entity.end;
    const startBook = bibleInfo.books.indexOf(startBcv.b) + 1;
    const endBook = bibleInfo.books.indexOf(endBcv.b) + 1;

    for (let book = startBook; book <= endBook; book++) {
      const bookId = bibleInfo.books[book - 1];
      const chapterCount = bibleInfo.chapters[bookId].length;
      const firstChapter = book === startBook ? startBcv.c : 1;
      const lastChapter = book === endBook ? endBcv.c : chapterCount;

      for (let chapter = firstChapter; chapter <= lastChapter; chapter++) {
        const chapterVerseCount = bibleInfo.chapters[bookId][chapter - 1];
        const firstVerse = book === startBook && chapter === startBcv.c ? startBcv.v : 1;
        const lastVerse = book === endBook && chapter === endBcv.c ? endBcv.v : chapterVerseCount;

        for (let verse = firstVerse; verse <= lastVerse; verse++) {
          pushVerse(parsedQuote, bookId, chapter, verse, bibleIndex, bibleInfo);
        }
      }
    }
  }

  return parsedQuote;
}

function pushVerse(
  parsedQuote: ParsedQuote,
  bookId: string,
  chapter: number,
  verse: number,
  bibleIndex: BibleLanguage,
  bibleInfo: BibleInfo
): void {
  const bookNumber = bibleInfo.order[bookId];
  const bookName = bibleIndex.books[bookNumber - 1];
  const lastBook = parsedQuote.books[parsedQuote.books.length - 1];

  if (!lastBook || lastBook.id !== bookId) {
    parsedQuote.books.push({
      id: bookId,
      num: bookNumber,
      name: bookName,
      chapters: [],
    });
  }

  const currentBook = parsedQuote.books[parsedQuote.books.length - 1];
  const lastChapter = currentBook.chapters[currentBook.chapters.length - 1];

  if (!lastChapter || lastChapter.id !== chapter) {
    currentBook.chapters.push({
      id: chapter,
      verses: [],
    });
  }

  currentBook.chapters[currentBook.chapters.length - 1].verses.push(verse);
}
