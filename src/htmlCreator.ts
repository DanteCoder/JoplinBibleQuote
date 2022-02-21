import Book from './components/Book';
import Chapter from './components/Chapter';
import Citation from './components/Citation';
import Verse from './components/Verse';
import { PluginConfig } from './interfaces/config';
import { OsisBible } from './interfaces/osisBible';
import { ParsedQuote } from './interfaces/parsedQuote';
import { getVerseText } from './utils/getVerseText';

/**
 * Creates the html for a list of citations from a given osisBible
 * @param parsedQuotes
 * @param osisBible
 * @param pluginConfig
 * @returns html string
 */
export function createBlockHtml(
  parsedQuotes: Array<ParsedQuote>,
  osisBible: OsisBible,
  pluginConfig: PluginConfig
): string {
  const html = document.createElement('div');
  const padding = pluginConfig.verseFontSize * 2;
  html.setAttribute('style', `padding: ${padding}px`);

  for (const fullQuote of parsedQuotes) {
    const booksHtml = [];
    for (const book of fullQuote.books) {
      const chaptersHTML = [];
      for (const chapter of book.chapters) {
        const versesHTML = [];
        for (let verse of chapter.verses) {
          const verseText = getVerseText(osisBible, { book: book.num, chapter: chapter.id, verse });
          versesHTML.push(
            Verse({
              text: verseText,
              number: verse,
              displayNumber:
                pluginConfig.displayFormat === 'full' ||
                chapter.verses.length > 1 ||
                book.chapters.length > 1 ||
                fullQuote.books.length > 1,
              style: {
                fontSize: `${pluginConfig.verseFontSize}px`,
                textAlign: pluginConfig.verseAlignment,
              },
            })
          );
        }

        chaptersHTML.push(
          Chapter({
            verses: versesHTML,
            text: pluginConfig.chapterTitleText,
            number: chapter.id,
            displayChapter:
              pluginConfig.displayFormat === 'full' ||
              (pluginConfig.displayFormat === 'cite' && book.chapters.length > 1),
            style: {
              fontSize: `${pluginConfig.verseFontSize * 1.1}px`,
              padding: `${pluginConfig.chapterPadding}px`,
              textAlign: pluginConfig.chapterAlignment,
              textIndent: `${pluginConfig.verseFontSize * 2}px`,
            },
          })
        );
      }

      booksHtml.push(
        Book({
          chapters: chaptersHTML,
          name: book.name,
          displayName:
            pluginConfig.displayFormat === 'full' ||
            (pluginConfig.displayFormat === 'cite' && fullQuote.books.length > 1),
          style: {
            textAlign: pluginConfig.bookAlignment,
          },
        })
      );
    }

    html.innerHTML += Citation({
      books: booksHtml,
      citation: fullQuote.cite,
      osisIDWork: osisBible.$.osisIDWork,
      displayFullCitation: pluginConfig.displayFormat === 'cite',
      displayOsisIDWork: pluginConfig.displayBibleVersion,
      style: {
        fontSize: `${pluginConfig.verseFontSize}px`,
      },
    });

    // Add a line separator after the citation if theres is more than one
    // and don't add a separator to the last one
    if (fullQuote !== parsedQuotes[parsedQuotes.length - 1]) {
      html.innerHTML += `<hr style="border: none; border-top: 1px solid grey; margin: ${pluginConfig.verseFontSize}px">`;
    }
  }

  return html.outerHTML;
}
interface VerseOptions {
  displayNumber: boolean;
  style: any;
}

interface ChapterOptions {
  chapterNumber: number;
  chapterText: string;
  displayChapter: boolean;
  style: any;
}

interface BookOptions {
  bookName: string;
  displayBookName: boolean;
  style: any;
}

interface CitationOptions {
  citation: string;
  diplayFullCitation: boolean;
  displayOsisIDWork: boolean;
  osisIDWork: string;
  style: any;
}
