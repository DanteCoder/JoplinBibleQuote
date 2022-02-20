import { OsisBible } from 'src/interfaces/osisBible';

/**
 * Extracts a verse from an OSIS Bible
 * @param osisBible
 * @param bcv
 * @returns string verse
 */
export function getVerseText(osisBible: OsisBible, bcv: BCV): string {
  let verseText = osisBible.div[bcv.book - 1].chapter[bcv.chapter - 1].verse[bcv.verse - 1]._;
  verseText = verseText.trim();
  verseText = verseText.replace(/\n /g, '<br>----');
  verseText = verseText.replace(/\s+/g, ' ');
  verseText = verseText.replace(/----/g, '\t');

  return verseText;
}

interface BCV {
  book: number;
  chapter: number;
  verse: number;
}
