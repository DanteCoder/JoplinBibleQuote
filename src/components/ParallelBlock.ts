import { BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedEntity } from '../interfaces/parseResult';
import { cssObj2String } from '../utils/cssObj2String';
import { parseQuote } from '../utils/parseQuote';
import bibleIndexFull from '../bibleIndex';
import ParallelChapter from './ParallelChapter';
import ParallelVerses from './ParallelVerses';
import ParallelBook from './ParallelBook';

/**
 * Creates the html for parallel bible versions
 * @param props
 * @returns html string
 */
export default function ParallelBlock(props: Props) {
  const { bibleIndex, bibleInfo, osisBibles, parsedEntity, pluginConfig } = props;
  const html = document.createElement('div');

  html.setAttribute(
    'style',
    cssObj2String({
      padding: '30px',
    })
  );

  for (const osisObject of parsedEntity.osisObjects) {
    const parsedQuote = parseQuote(osisObject, bibleIndex, bibleInfo);

    for (const book of parsedQuote.books) {
      html.innerHTML += ParallelBook({
        displayName:
          pluginConfig.displayFormat === 'full' ||
          (pluginConfig.displayFormat === 'cite' && parsedQuote.books.length > 1),
        name: book.name,
        style: {
          textAlign: pluginConfig.bookAlignment,
        },
        versions: parsedEntity.versions.length,
      });
      for (const chapter of book.chapters) {
        const parallelVerses = ParallelVerses({
          bookNum: book.num,
          chapter: chapter,
          osisBibles,
          versions: parsedEntity.versions,
          style: {
            fontSize: `${pluginConfig.verseFontSize}px`,
            textAlign: pluginConfig.verseAlignment,
          },
        });

        html.innerHTML += ParallelChapter({
          versions: parsedEntity.versions.length,
          displayChapter: true,
          number: chapter.id,
          parallelVerses,
          style: {
            fontSize: `${pluginConfig.verseFontSize * 1.1}px`,
            padding: `${pluginConfig.chapterPadding}px`,
            textAlign: pluginConfig.chapterAlignment,
          },
          text: bibleIndexFull[pluginConfig.bookNamesLang].chapterTitle,
        });
      }
    }
  }

  return html.outerHTML;
}

interface Props {
  bibleIndex: BibleLanguage;
  bibleInfo: any;
  parsedEntity: ParsedEntity;
  osisBibles: Array<OsisBible>;
  pluginConfig: PluginConfig;
}
