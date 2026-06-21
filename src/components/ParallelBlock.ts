import { BibleInfo, BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedEntity } from '../interfaces/parseResult';
import { bibleIndexFull } from '../languages';
import { cssObj2String } from '../utils/cssObj2String';
import { parseQuote } from '../utils/parseQuote';
import BookName from './BookName';
import ChapterTitle from './ChapterTitle';
import FullCitation from './FullCitation';
import ParallelVerses from './ParallelVerses';

export default function ParallelBlock(props: Props) {
  const { bibleIndex, bibleInfo, osisBibles, parsedEntity, pluginConfig } = props;
  const html = document.createElement('div');

  html.setAttribute('style', cssObj2String({ padding: '30px' }));

  for (const osisObject of parsedEntity.osisObjects) {
    const parsedQuote = parseQuote(osisObject, bibleIndex, bibleInfo);

    html.appendChild(buildCitationsGrid(parsedQuote, parsedEntity.versions, pluginConfig));

    for (const book of parsedQuote.books) {
      if (parsedQuote.books.length > 1) {
        html.innerHTML += BookName({
          name: book.name,
          style: {
            fontSize: `${pluginConfig.verseFontSize * 1.6}px`,
            margin: '0px',
            textAlign: pluginConfig.bookAlignment,
          },
        });
      }

      for (const chapter of book.chapters) {
        if (parsedQuote.books.length > 1 || book.chapters.length > 1) {
          html.innerHTML += ChapterTitle({
            number: chapter.id,
            style: {
              fontSize: `${pluginConfig.verseFontSize * 1.1}px`,
              padding: `${pluginConfig.chapterPadding}px`,
              textAlign: pluginConfig.chapterAlignment,
            },
            text: bibleIndexFull[pluginConfig.language].chapter,
          });
        }

        html.innerHTML += ParallelVerses({
          bookId: book.id,
          chapter,
          osisBibles,
          versions: parsedEntity.versions,
          style: {
            fontSize: `${pluginConfig.verseFontSize}px`,
            textAlign: pluginConfig.verseAlignment,
          },
        });
      }
    }

    if (osisObject !== parsedEntity.osisObjects[parsedEntity.osisObjects.length - 1]) {
      html.innerHTML += `<hr style="border: none; border-top: 1px solid grey; margin: ${pluginConfig.verseFontSize}px">`;
    }
  }

  return html.outerHTML;
}

function buildCitationsGrid(
  parsedQuote: { cite: string },
  versions: Array<string>,
  pluginConfig: PluginConfig
): HTMLDivElement {
  const div = document.createElement('div');
  div.setAttribute(
    'style',
    cssObj2String({
      display: 'grid',
      columnGap: `${pluginConfig.verseFontSize}px`,
      gridTemplateColumns: '1fr '.repeat(versions.length),
    })
  );

  for (const version of versions) {
    div.innerHTML += FullCitation({
      citation: parsedQuote.cite,
      displayOsisIDWork: true,
      osisIDWork: version,
      style: { fontSize: `${pluginConfig.verseFontSize}px` },
    });
  }

  return div;
}

interface Props {
  bibleIndex: BibleLanguage;
  bibleInfo: BibleInfo;
  parsedEntity: ParsedEntity;
  osisBibles: Array<OsisBible>;
  pluginConfig: PluginConfig;
}
