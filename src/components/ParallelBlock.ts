import { BibleInfo, BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedEntity } from '../interfaces/parseResult';
import { bibleIndexFull } from '../languages';
import { createHtml } from '../utils/createHtml';
import { parseQuote } from '../utils/parseQuote';
import BookName from './BookName';
import ChapterTitle from './ChapterTitle';
import FullCitation from './FullCitation';
import ParallelVerses from './ParallelVerses';

export default function ParallelBlock(props: Props) {
  const { bibleIndex, bibleInfo, osisBibles, parsedEntity, pluginConfig } = props;
  let content = '';

  for (const osisObject of parsedEntity.osisObjects) {
    const parsedQuote = parseQuote(osisObject, bibleIndex, bibleInfo);

    content += buildCitationsGrid(parsedQuote, parsedEntity.versions);

    for (const book of parsedQuote.books) {
      if (parsedQuote.books.length > 1) {
        content += BookName({
          name: book.name,
        });
      }

      for (const chapter of book.chapters) {
        if (parsedQuote.books.length > 1 || book.chapters.length > 1) {
          content += ChapterTitle({
            number: chapter.id,
            text: bibleIndexFull[pluginConfig.language].chapter,
          });
        }

        content += ParallelVerses({
          bookId: book.id,
          chapter,
          osisBibles,
          versions: parsedEntity.versions,
        });
      }
    }

    if (osisObject !== parsedEntity.osisObjects[parsedEntity.osisObjects.length - 1]) {
      content += '<hr class="bq-hr-light">';
    }
  }

  return createHtml('div', content, { className: 'bq-block' });
}

function buildCitationsGrid(parsedQuote: { cite: string }, versions: Array<string>): string {
  let content = '';

  for (const version of versions) {
    content += FullCitation({
      citation: parsedQuote.cite,
      displayOsisIDWork: true,
      osisIDWork: version,
    });
  }

  return createHtml('div', content, {
    className: 'bq-citation-grid',
    style: { gridTemplateColumns: `1fr `.repeat(versions.length).trim() },
  });
}

interface Props {
  bibleIndex: BibleLanguage;
  bibleInfo: BibleInfo;
  parsedEntity: ParsedEntity;
  osisBibles: Array<OsisBible>;
  pluginConfig: PluginConfig;
}
