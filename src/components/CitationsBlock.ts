import { BibleInfo, BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedQuote } from '../interfaces/parsedQuote';
import { ParsedEntity } from '../interfaces/parseResult';
import { bibleIndexFull } from '../languages';
import { createHtml } from '../utils/createHtml';
import { getVerseText } from '../utils/getVerseText';
import { parseQuote } from '../utils/parseQuote';
import Book from './Book';
import Chapter from './Chapter';
import Citation from './Citation';
import Verse from './Verse';

export default function CitationsBlock(props: Props) {
  const { bibleIndex, bibleInfo, defaultOsisBible, entity, osisBibles, pluginConfig } = props;
  const parsedQuotes: Array<ParsedQuote> = entity.osisObjects.map(osisObject =>
    parseQuote(osisObject, bibleIndex, bibleInfo)
  );

  let content = '';

  for (const version of entity.versions) {
    const osisBible = resolveOsisBible(version, defaultOsisBible, osisBibles);

    for (const fullQuote of parsedQuotes) {
      const booksHtml = buildBooksHtml(fullQuote, osisBible, bibleIndex, bibleInfo, pluginConfig);

      content += Citation({
        books: booksHtml,
        citation: fullQuote.cite,
        osisIDWork: osisBible.$.osisIDWork,
        displayFullCitation: true,
        displayOsisIDWork: true,
      });

      if (fullQuote !== parsedQuotes[parsedQuotes.length - 1]) {
        content += '<hr class="bq-hr-light">';
      }
    }

    if (version !== entity.versions[entity.versions.length - 1]) {
      content += '<hr class="bq-hr-double">';
    }
  }

  return createHtml('div', content, { className: 'bq-block' });
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
        });
      });

      return Chapter({
        verses: versesHtml,
        text: bibleIndexFull[pluginConfig.language].chapter,
        number: chapter.id,
        displayChapter: book.chapters.length > 1 || fullQuote.books.length > 1,
        indented: true,
      });
    });

    return Book({
      chapters: chaptersHtml,
      name: book.name,
      displayName: fullQuote.books.length > 1,
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
