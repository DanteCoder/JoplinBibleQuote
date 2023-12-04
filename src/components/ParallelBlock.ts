import { BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedEntity } from '../interfaces/parseResult';
import { cssObj2String } from '../utils/cssObj2String';
import { parseQuote } from '../utils/parseQuote';
import { bibleIndexFull } from '../languages';
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

    // Add a line separator between citations
    if (osisObject !== parsedEntity.osisObjects[parsedEntity.osisObjects.length - 1]) {
      html.innerHTML += `<hr style="border: none; border-top: 1px solid grey; margin: ${pluginConfig.verseFontSize}px">`;
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
