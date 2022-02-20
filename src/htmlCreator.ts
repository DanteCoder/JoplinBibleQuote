/**
 * Creates the html for a verse
 * @param verseText
 * @param verseNumber
 * @param verseOptions
 * @returns html string
 */
export function createVerseHtml(verseText: string, verseNumber: number, verseOptions: VerseOptions): string {
  let html = document.createElement('div');
  html.setAttribute('style', `font-size: ${verseOptions.verseFontSize}px;`);

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
      `padding-left: ${chapterOptions.chapterPadding}px;` +
        `padding-right: ${chapterOptions.chapterPadding}px;` +
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
  html.setAttribute('style', `padding: 35px;`);

  if (citationOptions.diplayFullCitation) {
    const citationTitle = document.createElement('h3');
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
interface VerseOptions {
  displayNumber: boolean;
  verseFontSize: number;
}

interface ChapterOptions {
  chapterAlignment: string;
  chapterNumber: number;
  chapterPadding: number;
  chapterText: string;
  displayChapter: boolean;
}

interface BookOptions {
  bookAlignment: string;
  bookName: string;
  displayBookName: boolean;
}

interface CitationOptions {
  citation: string;
  diplayFullCitation: boolean;
  displayOsisIDWork: boolean;
  osisIDWork: string;
}
