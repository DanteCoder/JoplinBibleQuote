import { OsisBible } from '../interfaces/osisBible';
import { BCV } from '../interfaces/osisObject';

const SENTINEL = '\t';

export function getVerseText(osisBible: OsisBible, bcv: BCV): string {
  const book = osisBible.div.find(book => book.$.osisID === bcv.b)!;
  const chapter = book.chapter[bcv.c - 1];
  const verse = chapter.verse[bcv.v - 1];
  let verseText = verse._;

  verseText = verseText.trim();
  verseText = verseText.replace(/\n /g, '<br>' + SENTINEL);
  verseText = verseText.replace(/\s+/g, ' ');
  verseText = verseText.replace(new RegExp(SENTINEL, 'g'), '\t');

  return verseText;
}
