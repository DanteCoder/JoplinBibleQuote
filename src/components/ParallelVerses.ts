import { OsisBible } from '../interfaces/osisBible';
import { Chapter } from '../interfaces/parsedQuote';
import { cssObj2String } from '../utils/cssObj2String';
import { getVerseText } from '../utils/getVerseText';
import Verse from './Verse';

/**
 * Creates the html for parallel verses
 * @param props
 * @returns html string
 */
export default function ParallelVerses(props: Props) {
  const { bookNum, chapter, osisBibles, style, versions } = props;
  const html = document.createElement('div');
  html.setAttribute(
    'style',
    cssObj2String({
      display: 'grid',
      rowGap: `${style.fontSize ? parseFloat(style.fontSize) / 2 : 8}px`,
      columnGap: `${style.fontSize ? parseFloat(style.fontSize) : 16}px`,
      gridTemplateColumns: '1fr '.repeat(versions.length),
    })
  );

  for (const verse of chapter.verses) {
    for (const version of versions) {
      const verseText = getVerseText(
        osisBibles.find((bible) => bible.$.osisIDWork === version),
        { book: bookNum, chapter: chapter.id, verse }
      );

      html.innerHTML += Verse({ displayNumber: true, number: verse, text: verseText, style });
    }
  }

  return html.outerHTML;
}

interface Props {
  bookNum: number;
  chapter: Chapter;
  versions: Array<string>;
  osisBibles: Array<OsisBible>;
  style: any;
}
