import { PluginConfig } from './interfaces/config';
import { OsisBible } from './interfaces/osisBible';
import { ParsedQuote } from './interfaces/parsedQuote';
import { getVerseText } from './utils/getVerseText';

/**
 * Creates the html for a verse
 * @param verseText
 * @param verseNumber
 * @param verseOptions
 * @returns html string
 */
export function createVerseHtml(verseText: string, verseNumber: number, verseOptions: VerseOptions): string {
  let html = document.createElement('div');
  html.setAttribute(
    'style',
    `font-size: ${verseOptions.verseFontSize}px;` + `text-align: ${verseOptions.verseTextAlign};`
  );

  if (verseOptions.displayNumber) {
    html.innerHTML += `${verseNumber}. `;
  }

  html.innerHTML += `${verseText}`;

  return html.outerHTML;
}

/**
 * Creates the html for a chapter
 * @param versesHtml
 * @param chapterOptions
 * @returns html string
 */
export function createChapterHtml(versesHtml: Array<string>, chapterOptions: ChapterOptions): string {
  const html = document.createElement('div');

  if (chapterOptions.displayChapter) {
    const chapterTitle = document.createElement('h3');
    chapterTitle.setAttribute(
      'style',
      `font-size: ${chapterOptions.chapterFontSize}px;` +
        `text-indent: ${chapterOptions.chapterTextIndent}px;` +
        `text-align: ${chapterOptions.chapterAlignment}`
    );
    chapterTitle.innerHTML = `${chapterOptions.chapterText} ${chapterOptions.chapterNumber}`;
    html.appendChild(chapterTitle);
  }

  const versesDiv = document.createElement('div');
  versesDiv.setAttribute('style', `display: flex; flex-direction: column; gap: 8px;`);

  for (const verseHtml of versesHtml) {
    versesDiv.innerHTML += verseHtml;
  }

  html.appendChild(versesDiv);

  return html.outerHTML;
}

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
    bookNameTitle.setAttribute('style', `text-align:${bookOptions.bookAlignment};`);
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
    citationTitle.setAttribute('style', `font-size: ${citationOptions.citationFontSize}px;`);
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
            createVerseHtml(verseText, verse, {
              verseFontSize: pluginConfig.verseFontSize,
              verseTextAlign: pluginConfig.verseAlignment,
              displayNumber:
                pluginConfig.displayFormat === 'full' ||
                chapter.verses.length > 1 ||
                book.chapters.length > 1 ||
                fullQuote.books.length > 1,
            })
          );
        }

        chaptersHTML.push(
          createChapterHtml(versesHTML, {
            chapterAlignment: pluginConfig.chapterAlignment,
            chapterFontSize: pluginConfig.verseFontSize * 1.1,
            chapterNumber: chapter.id,
            chapterPadding: pluginConfig.chapterPadding,
            chapterText: pluginConfig.chapterTitleText,
            chapterTextIndent: pluginConfig.verseFontSize * 2,
            displayChapter:
              pluginConfig.displayFormat === 'full' ||
              (pluginConfig.displayFormat === 'cite' && book.chapters.length > 1),
          })
        );
      }

      booksHtml.push(
        createBookHtml(chaptersHTML, {
          bookAlignment: pluginConfig.bookAlignment,
          bookName: book.name,
          displayBookName:
            pluginConfig.displayFormat === 'full' ||
            (pluginConfig.displayFormat === 'cite' && fullQuote.books.length > 1),
        })
      );
    }

    html.innerHTML += createCitationHtml(booksHtml, {
      citation: fullQuote.cite,
      citationFontSize: pluginConfig.verseFontSize,
      osisIDWork: osisBible.$.osisIDWork,
      diplayFullCitation: pluginConfig.displayFormat === 'cite',
      displayOsisIDWork: pluginConfig.displayBibleVersion,
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
  verseFontSize: number;
  verseTextAlign: string;
}

interface ChapterOptions {
  chapterAlignment: string;
  chapterFontSize: number;
  chapterNumber: number;
  chapterPadding: number;
  chapterText: string;
  chapterTextIndent: number;
  displayChapter: boolean;
}

interface BookOptions {
  bookAlignment: string;
  bookName: string;
  displayBookName: boolean;
}

interface CitationOptions {
  citation: string;
  citationFontSize: number;
  diplayFullCitation: boolean;
  displayOsisIDWork: boolean;
  osisIDWork: string;
}
