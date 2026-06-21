import { BibleInfo, BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedQuote } from '../interfaces/parsedQuote';
import { ParsedEntity } from '../interfaces/parseResult';
import { bibleIndexFull } from '../languages';
import { cssObj2String } from '../utils/cssObj2String';
import { getVerseText } from '../utils/getVerseText';
import { parseQuote } from '../utils/parseQuote';
import Book from './Book';
import Chapter from './Chapter';
import Citation from './Citation';
import Verse from './Verse';

export default function CitationsBlock(props: Props) {
  const { bibleIndex, bibleInfo, defaultOsisBible, entity, osisBibles, pluginConfig } = props;
  const html = document.createElement('div');

  html.setAttribute('style', cssObj2String({ padding: '30px' }));

  const parsedQuotes: Array<ParsedQuote> = entity.osisObjects.map(osisObject =>
    parseQuote(osisObject, bibleIndex, bibleInfo)
  );

  for (const version of entity.versions) {
    const osisBible = resolveOsisBible(version, defaultOsisBible, osisBibles);

    for (const fullQuote of parsedQuotes) {
      const booksHtml = buildBooksHtml(fullQuote, osisBible, bibleIndex, bibleInfo, pluginConfig);

      html.innerHTML += Citation({
        books: booksHtml,
        citation: fullQuote.cite,
        osisIDWork: osisBible.$.osisIDWork,
        displayFullCitation: true,
        displayOsisIDWork: true,
        style: { fontSize: `${pluginConfig.verseFontSize}px` },
      });

      if (fullQuote !== parsedQuotes[parsedQuotes.length - 1]) {
        html.innerHTML += `<hr style="border: none; border-top: 1px solid grey; margin: ${pluginConfig.verseFontSize}px">`;
      }
    }

    if (version !== entity.versions[entity.versions.length - 1]) {
      html.innerHTML += `<hr style="${cssObj2String({
        border: 'none',
        borderTop: '3px double grey',
        marginTop: `${pluginConfig.verseFontSize}px`,
        marginBottom: `${pluginConfig.verseFontSize}px`,
      })}">`;
    }
  }

  return html.outerHTML;
}

function resolveOsisBible(version: string, defaultOsisBible: OsisBible, osisBibles: Array<OsisBible>): OsisBible {
  if (version === 'default') return defaultOsisBible;

  return osisBibles.find(bible => bible.$.osisIDWork === version)!;
}

function buildBooksHtml(
  fullQuote: ParsedQuote,
  osisBible: OsisBible,
  bibleIndex: BibleLanguage,
  bibleInfo: BibleInfo,
  pluginConfig: PluginConfig
): Array<string> {
  return fullQuote.books.map(book => {
    const chaptersHtml = book.chapters.map(chapter => {
      const versesHtml = chapter.verses.map(verse => {
        const verseText = getVerseText(osisBible, { b: book.id, c: chapter.id, v: verse });

        return Verse({
          text: verseText,
          number: verse,
          displayNumber: chapter.verses.length > 1 || book.chapters.length > 1 || fullQuote.books.length > 1,
          style: { fontSize: `${pluginConfig.verseFontSize}px`, textAlign: pluginConfig.verseAlignment },
        });
      });

      return Chapter({
        verses: versesHtml,
        text: bibleIndexFull[pluginConfig.language].chapter,
        number: chapter.id,
        displayChapter: book.chapters.length > 1 || fullQuote.books.length > 1,
        style: {
          fontSize: `${pluginConfig.verseFontSize * 1.1}px`,
          padding: `${pluginConfig.chapterPadding}px`,
          textAlign: pluginConfig.chapterAlignment,
          textIndent: `${pluginConfig.verseFontSize * 2}px`,
        },
      });
    });

    return Book({
      chapters: chaptersHtml,
      name: book.name,
      displayName: fullQuote.books.length > 1,
      style: {
        fontSize: `${pluginConfig.verseFontSize * 1.6}px`,
        margin: '0px',
        textAlign: pluginConfig.bookAlignment,
      },
    });
  });
}

interface Props {
  bibleIndex: BibleLanguage;
  bibleInfo: BibleInfo;
  entity: ParsedEntity;
  defaultOsisBible: OsisBible;
  osisBibles: Array<OsisBible>;
  pluginConfig: PluginConfig;
}
