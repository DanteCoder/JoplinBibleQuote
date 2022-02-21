import Chapter from './components/Chapter';
import Verse from './components/Verse';
import { PluginConfig } from './interfaces/config';
import { OsisBible } from './interfaces/osisBible';
import { ParsedQuote } from './interfaces/parsedQuote';
import { cssObj2String } from './utils/cssObj2String';
import { getVerseText } from './utils/getVerseText';

/**
 * Creates the html for a book
 * @param chaptersHtml
 * @param bookOptions
 * @returns html string
 */
export function createBookHtml(chaptersHtml: Array<string>, bookOptions: BookOptions) {
  const html = document.createElement('div');

  if (bookOptions.displayBookName) {
    const bookNameTitle = document.createElement('h2');
    bookNameTitle.setAttribute('style', cssObj2String(bookOptions.style));
    bookNameTitle.innerHTML = `<b>${bookOptions.bookName}<b>`;
    html.appendChild(bookNameTitle);
  }

  for (const chapterHtml of chaptersHtml) {
    html.innerHTML += chapterHtml;
  }

  return html.outerHTML;
}

/**
 * Creates the html for a citation
 * @param booksHtml
 * @param citationOptions
 * @returns html string
 */
export function createCitationHtml(booksHtml: Array<string>, citationOptions: CitationOptions): string {
  const html = document.createElement('div');

  if (citationOptions.diplayFullCitation) {
    const citationTitle = document.createElement('h3');
    citationTitle.setAttribute('style', cssObj2String(citationOptions.style));
    citationTitle.innerHTML = `<b>${citationOptions.citation}<b>`;
    if (citationOptions.displayOsisIDWork) {
      citationTitle.innerHTML += `<b> (${citationOptions.osisIDWork})<b>`;
    }
    html.appendChild(citationTitle);
  }

  for (const bookHtml of booksHtml) {
    html.innerHTML += bookHtml;
  }

  return html.outerHTML;
}

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
        createBookHtml(chaptersHTML, {
          bookName: book.name,
          displayBookName:
            pluginConfig.displayFormat === 'full' ||
            (pluginConfig.displayFormat === 'cite' && fullQuote.books.length > 1),
          style: {
            textAlign: pluginConfig.bookAlignment,
          },
        })
      );
    }

    html.innerHTML += createCitationHtml(booksHtml, {
      citation: fullQuote.cite,
      osisIDWork: osisBible.$.osisIDWork,
      diplayFullCitation: pluginConfig.displayFormat === 'cite',
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
