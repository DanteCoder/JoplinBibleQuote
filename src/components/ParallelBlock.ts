import { BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedEntity } from '../interfaces/parseResult';
import { cssObj2String } from '../utils/cssObj2String';
import { parseQuote } from '../utils/parseQuote';
import bibleIndexFull from '../bibleIndex';
import ChapterTitle from './ChapterTitle';
import ParallelVerses from './ParallelVerses';
import BookName from './BookTitle';
import FullCitation from './FullCitation';

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

    const citationsDiv = document.createElement('div');
    citationsDiv.setAttribute(
      'style',
      cssObj2String({
        display: 'grid',
        columnGap: `${pluginConfig.verseFontSize}px`,
        gridTemplateColumns: '1fr '.repeat(parsedEntity.versions.length),
      })
    );
    for (const version of parsedEntity.versions) {
      citationsDiv.innerHTML += FullCitation({
        citation: parsedQuote.cite,
        displayOsisIDWork: true,
        osisIDWork: version,
        style: {
          fontSize: `${pluginConfig.verseFontSize}px`,
        },
      });
    }
    html.appendChild(citationsDiv);

    for (const book of parsedQuote.books) {
      if (
        pluginConfig.displayFormat === 'full' ||
        (pluginConfig.displayFormat === 'cite' && parsedQuote.books.length > 1)
      ) {
        html.innerHTML += BookName({
          name: book.name,
          style: {
            textAlign: pluginConfig.bookAlignment,
          },
        });
      }

      for (const chapter of book.chapters) {
        if (
          pluginConfig.displayFormat === 'full' ||
          (pluginConfig.displayFormat === 'cite' && (parsedQuote.books.length > 1 || book.chapters.length > 1))
        ) {
          html.innerHTML += ChapterTitle({
            number: chapter.id,
            style: {
              fontSize: `${pluginConfig.verseFontSize * 1.1}px`,
              padding: `${pluginConfig.chapterPadding}px`,
              textAlign: pluginConfig.chapterAlignment,
            },
            text: bibleIndexFull[pluginConfig.bookNamesLang].chapterTitle,
          });
        }

        html.innerHTML += ParallelVerses({
          bookNum: book.num,
          chapter: chapter,
          osisBibles,
          versions: parsedEntity.versions,
          style: {
            fontSize: `${pluginConfig.verseFontSize}px`,
            textAlign: pluginConfig.verseAlignment,
          },
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
