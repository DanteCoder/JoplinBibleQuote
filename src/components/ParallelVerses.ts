import { OsisBible } from '../interfaces/osisBible';
import { Chapter } from '../interfaces/parsedQuote';
import { createHtml } from '../utils/createHtml';
import { getVerseText } from '../utils/getVerseText';
import Verse from './Verse';

export default function ParallelVerses(props: Props) {
  const { bookId, chapter, osisBibles, versions } = props;
  let content = '';

  for (const verse of chapter.verses) {
    for (const version of versions) {
      const verseText = getVerseText(osisBibles.find(bible => bible.$.osisIDWork === version)!, {
        b: bookId,
        c: chapter.id,
        v: verse,
      });
      content += Verse({ displayNumber: true, number: verse, text: verseText, style: {} });
    }
  }

  return createHtml('div', content, {
    className: 'bq-parallel-grid',
    style: { gridTemplateColumns: `1fr `.repeat(versions.length).trim() },
  });
}

interface Props {
  bookId: string;
  chapter: Chapter;
  versions: Array<string>;
  osisBibles: Array<OsisBible>;
}
