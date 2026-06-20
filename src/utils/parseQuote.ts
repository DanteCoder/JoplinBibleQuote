import { BibleInfo, BibleLanguage } from 'src/interfaces/bibleIndex';
import { BCV, OsisObject } from 'src/interfaces/osisObject';
import { ParsedQuote } from 'src/interfaces/parsedQuote';
import { osis2Cite } from './osis2Cite';

export function parseQuote(osisObject: OsisObject, bibleIndex: BibleLanguage, bibleInfo: BibleInfo): ParsedQuote {
  const parsedQuote: ParsedQuote = { books: [], cite: '' };

  let startBcv: BCV | null = null;
  let endBcv: BCV | null = null;

  parsedQuote.cite = osis2Cite(osisObject, bibleIndex, bibleInfo);

  for (const entity of osisObject.entities) {
    startBcv = entity.start;
    endBcv = entity.end;

    const startBook = bibleInfo.books.indexOf(startBcv.b) + 1;
    const endBook = bibleInfo.books.indexOf(endBcv.b) + 1;

    for (let book = startBook; book <= endBook; book++) {
      const bookId = bibleInfo.books[book - 1];
      const bookChapterNumbers = bibleInfo.chapters[bookId].length;

      if (startBook === endBook) {
        for (let chapter = startBcv.c; chapter <= endBcv.c; chapter++) {
          const chaperVerseNumber = bibleInfo.chapters[bookId][chapter - 1];

          if (startBcv.c === endBcv.c) {
            for (let verse = startBcv.v; verse <= endBcv.v; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          } else if (chapter === startBcv.c) {
            for (let verse = startBcv.v; verse <= chaperVerseNumber; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          } else if (chapter === endBcv.c) {
            for (let verse = 1; verse <= endBcv.v; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          } else {
            for (let verse = 1; verse <= chaperVerseNumber; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          }
        }
      } else if (book === startBook) {
        for (let chapter = startBcv.c; chapter <= bookChapterNumbers; chapter++) {
          const c_v_num = bibleInfo.chapters[bookId][chapter - 1];

          if (chapter === startBcv.c) {
            for (let verse = startBcv.v; verse <= c_v_num; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          } else {
            for (let verse = 1; verse <= c_v_num; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          }
        }
      } else if (book === endBook) {
        for (let chapter = 1; chapter <= endBcv.c; chapter++) {
          const chapterVerseNumber = bibleInfo.chapters[bookId][chapter - 1];

          if (chapter === endBcv.c) {
            for (let verse = 1; verse <= endBcv.v; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          } else {
            for (let verse = 1; verse <= chapterVerseNumber; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          }
        }
      } else {
        for (let chapter = 1; chapter <= bookChapterNumbers; chapter++) {
          const chapterVerseNumber = bibleInfo.chapters[bookId][chapter - 1];

          for (let verse = 1; verse <= chapterVerseNumber; verse++) {
            push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
          }
        }
      }
    }
  }

  function push2ParsedQuote(singleOsisVerse: string): void {
    const split = singleOsisVerse.split('.');
    const osisParts: BCV = {
      b: split[0],
      c: parseInt(split[1]),
      v: parseInt(split[2]),
    };
    let lastBookIndex = 0;
    let lastChapterIndex = 0;

    const bookNumber = bibleInfo.order[osisParts.b];
    const bookName = bibleIndex.books[bookNumber - 1];

    if (parsedQuote.books.length === 0) {
      parsedQuote.books.push({
        id: osisParts.b,
        num: bookNumber,
        name: bookName,
        chapters: [],
      });
    } else {
      lastBookIndex = parsedQuote.books.length - 1;

      if (parsedQuote.books[lastBookIndex].id !== osisParts.b) {
        parsedQuote.books.push({
          id: osisParts.b,
          num: bookNumber,
          name: bookName,
          chapters: [],
        });
      }
    }

    lastBookIndex = parsedQuote.books.length - 1;

    if (parsedQuote.books[lastBookIndex].chapters.length === 0) {
      parsedQuote.books[lastBookIndex].chapters.push({
        id: osisParts.c,
        verses: [],
      });
    } else {
      lastChapterIndex = parsedQuote.books[lastBookIndex].chapters.length - 1;

      if (parsedQuote.books[lastBookIndex].chapters[lastChapterIndex].id !== osisParts.c) {
        parsedQuote.books[lastBookIndex].chapters.push({
          id: osisParts.c,
          verses: [],
        });
      }
    }

    lastChapterIndex = parsedQuote.books[lastBookIndex].chapters.length - 1;

    parsedQuote.books[lastBookIndex].chapters[lastChapterIndex].verses.push(osisParts.v);
  }

  return parsedQuote;
}
