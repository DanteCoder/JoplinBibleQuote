import { parseString as parseXmlString } from 'xml2js';
import fs = require('fs');
import path = require('path');
import bibleIndexFull from './bibleIndex';

// Interfaces
import { BibleLanguage } from './interfaces/bibleIndex';
import { OsisBible } from './interfaces/osisBible';
import { ParsedQuote } from './interfaces/parsedQuote';
import { PluginConfig } from './interfaces/config';
import { OsisParts } from './interfaces/osisParts';

const pluginConfig: PluginConfig = getPluginConfig();
let bibleIndex: BibleLanguage = bibleIndexFull[pluginConfig.bookNamesLanguage];
let osisBible: OsisBible = { div: [{ chapter: [{ verse: [{ _: '' }] }] }] };
const bcv = init();
const bibleInfo = bcv.translation_info();

export default function (context) {
  return {
    plugin: function (markdownIt, _options) {
      const defaultRender =
        markdownIt.renderer.rules.fence ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options, env, self);
        };

      markdownIt.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const token = tokens[idx];

        if (token.info !== 'bible') return defaultRender(tokens, idx, options, env, self);

        if (localStorage.getItem('pluginSettingsUpdated') === 'true') {
          localStorage.setItem('pluginSettingsUpdated', 'false');
          init();
        }

        if (pluginConfig.biblePath === null) {
          const noBibleHtml = `<div style="padding:35px; border: 1px solid #545454;">
					<p style="text-align: center;">There is no selected OSIS xml bible or the path is invalid.<p></div>`;

          return noBibleHtml;
        }

        let html = '';
        let quotes = token.content.replace(/\n/g, ' ').match(/\(.*?\)/g);

        if (quotes) {
          html += '<div style="border:1px solid #545454;">';

          for (let quote of quotes) {
            const full_quote = parseQuote(quote);
            html += '<div style="padding: 35px;">';

            if (pluginConfig.displayFormat === 'cite') {
              html += `<h3><b>${full_quote.cite}</b></h3>`;
            }

            for (let b of full_quote.books) {
              if (
                pluginConfig.displayFormat === 'full' ||
                (pluginConfig.displayFormat === 'cite' && full_quote.books.length > 1)
              ) {
                html += `<h2 style="text-align:${pluginConfig.bookAlignment};"><b>${b.name}</b></h2>`;
              }

              for (let c of b.chapters) {
                if (
                  pluginConfig.displayFormat === 'full' ||
                  (pluginConfig.displayFormat === 'cite' && b.chapters.length > 1)
                ) {
                  html += `<h3 style="padding-left:${pluginConfig.chapterPadding}px; padding-right:${pluginConfig.chapterPadding}px; text-align:${pluginConfig.chapterAlignment}"><b>${pluginConfig.chapterTitleText} ${c.id}</b></h3>`;
                }

                html += `<div style="white-space: pre-wrap; font-size: ${pluginConfig.verseFontSize}px; text-align:${pluginConfig.verseAlignment}">`;

                let last_verse = null;
                for (let v of c.verses) {
                  let text = <string>osisBible.div[b.num - 1].chapter[c.id - 1].verse[v - 1]._;
                  text = text.trim();
                  text = text.replace(/\n /g, '<br>----');
                  text = text.replace(/\s+/g, ' ');
                  text = text.replace(/----/g, '\t');

                  html += `<bstyle="font-size: ${pluginConfig.verseFontSize}px">`;

                  if (v - 1 !== last_verse && last_verse !== null) {
                    html += '<br>';
                  }

                  if (pluginConfig.displayFormat === 'full') {
                    html += `${v}. `;
                  } else if (pluginConfig.displayFormat === 'cite') {
                    if (c.verses.length > 1 || b.chapters.length > 1 || full_quote.books.length > 1) {
                      html += `${v}. `;
                    }
                  }

                  html += `</b>${text}<br>`;

                  last_verse = v;
                }

                html += '</div>';
              }
            }
            html += '</div>';
            html += '<hr width="90%" size="1">';
          }
          html = html.slice(0, html.length - '<hr width="90%" size="1">'.length);
          html += '</div><br>';
        }

        return html;
      };
    },
  };
}

/**
 * Gets the plugin configuration from localStorage
 * @returns pluginConfig object
 */
function getPluginConfig(): PluginConfig {
  const pluginConfig: any = {
    citationLanguage: localStorage.getItem('citeLang'),
    bookNamesLanguage: localStorage.getItem('bookNamesLang'),
    biblePath: localStorage.getItem('biblePath'),
    bookAlignment: localStorage.getItem('bookAlignment'),
    chapterAlignment: localStorage.getItem('chapterAlignment'),
    chapterPadding: localStorage.getItem('chapterPadding'),
    verseFontSize: localStorage.getItem('verseFontSize'),
    verseAlignment: localStorage.getItem('verseAlignment'),
    displayFormat: localStorage.getItem('displayFormat'),
  };
  pluginConfig.chapterTitleText = bibleIndexFull[pluginConfig.bookNamesLanguage].chapterTitle;

  for (const key in pluginConfig) {
    if (pluginConfig[key] === '') pluginConfig[key] = null;
  }

  return pluginConfig;
}

/**
 * Initialize the config variables and import the corresponding bcv parser.
 * @returns bcv parser.
 */
function init(): any {
  try {
    osisBible = XmlBible2Js(pluginConfig.biblePath).osis.osisText[0];
  } catch (error) {
    pluginConfig.biblePath = null;
  }

  let bcvParser: any;
  switch (pluginConfig.citationLanguage) {
    case 'es':
      bcvParser = require('bible-passage-reference-parser/js/es_bcv_parser').bcv_parser;
      break;
    case 'en':
      bcvParser = require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser;
      break;
    case 'fr':
      bcvParser = require('bible-passage-reference-parser/js/fr_bcv_parser').bcv_parser;
      break;

    default:
      break;
  }
  const bcv = new bcvParser();

  return bcv;
}

/**
 * Parses an xml bible to a JS object
 * @param biblePath The path to the xml file
 * @returns Parsed xml bible
 */
function XmlBible2Js(biblePath: string): any {
  let parsedBible: object;

  const normalizedPath = path.normalize(biblePath);
  const xmlFile = fs.readFileSync(normalizedPath, 'utf8');
  parseXmlString(xmlFile, function (err, result) {
    if (err) throw err;
    parsedBible = result;
  });

  return parsedBible;
}

/**
 * Parses a bible quote like "Genesis 1:1" into a JS object.
 * @param quote
 * @returns The parsed quote organized in books, chapters and verses
 */
function parseQuote(quote: string): ParsedQuote {
  let parsedQuote: ParsedQuote = { books: [], cite: '' };

  // If the citation is empty return an empty parsedQuote
  if (bcv.parse(quote).osis() === '') {
    return parsedQuote;
  }

  // Options for the bcv parser
  bcv.set_options({
    osis_compaction_strategy: 'bcv',
    consecutive_combination_strategy: 'separate',
  });
  let bvcParsedObject = bcv.parse(quote).parsed_entities()[0];
  let startBcv = null;
  let endBcv = null;

  // Normalized citation
  parsedQuote.cite = osis2Cite(bvcParsedObject);

  for (let entity of bvcParsedObject.entities) {
    startBcv = entity.start;
    endBcv = entity.end;

    let startBook = bibleInfo.books.indexOf(startBcv.b) + 1;
    let endBook = bibleInfo.books.indexOf(endBcv.b) + 1;

    for (let book = startBook; book <= endBook; book++) {
      let bookId = bibleInfo.books[book - 1];
      // The number of books in the chapter
      let bookChapterNumbers = bibleInfo.chapters[bookId].length;

      if (startBook === endBook) {
        //If there is only one book in the citation
        for (let chapter = startBcv.c; chapter <= endBcv.c; chapter++) {
          // The number of verses in the chapter
          let chaperVerseNumber = bibleInfo.chapters[bookId][chapter - 1];

          if (startBcv.c === endBcv.c) {
            //If there is only one chapter in the citation
            for (let verse = startBcv.v; verse <= endBcv.v; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          } else if (chapter === startBcv.c) {
            //If chapter is the first chapter of the citation
            for (let verse = startBcv.v; verse <= chaperVerseNumber; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          } else if (chapter === endBcv.c) {
            //If chapter is the last chapter of the citation
            for (let verse = 1; verse <= endBcv.v; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          } else {
            //If chapter is any chapter in between the first and last chapters of the citation
            for (let verse = 1; verse <= chaperVerseNumber; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          }
        }
      } else if (book === startBook) {
        // If book is the first book of the citation
        for (let chapter = startBcv.c; chapter <= bookChapterNumbers; chapter++) {
          let c_v_num = bibleInfo.chapters[bookId][chapter - 1];

          if (chapter === startBcv.c) {
            //If chapter is the first chapter of the citation
            for (let verse = startBcv.v; verse <= c_v_num; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          } else {
            //If chapter is any chapter in between the first and last chapters, or is the last chapter of the citation
            for (let verse = 1; verse <= c_v_num; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          }
        }
      } else if (book === endBook) {
        // If book is the last book of the citation
        for (let chapter = 1; chapter <= endBcv.c; chapter++) {
          // The number of verses in the chapter
          let chapterVerseNumber = bibleInfo.chapters[bookId][chapter - 1];

          if (chapter === endBcv.c) {
            //If chapter is the last chapter of the citation
            for (let verse = 1; verse <= endBcv.v; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          } else {
            //If chapter is any chapter in between the first and last chapters, or is the first chapter of the citation
            for (let verse = 1; verse <= chapterVerseNumber; verse++) {
              push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
            }
          }
        }
      } else {
        // If book is any book in between the first and last books of the citation
        for (let chapter = 1; chapter <= bookChapterNumbers; chapter++) {
          // The number of verses in the chapter
          let chapterVerseNumber = bibleInfo.chapters[bookId][chapter - 1];

          for (let verse = 1; verse <= chapterVerseNumber; verse++) {
            push2ParsedQuote(bookId + '.' + chapter + '.' + verse);
          }
        }
      }
    }
  }

  /**
   * Extracts the book, chapter and verse from an osis citation
   * and pushes the book, chapter or verse to the parsedQuote
   * only if the elements are not already pushed.
   * @param singleOsisVerse the osis citation as "book.chapter.verse"
   */
  function push2ParsedQuote(singleOsisVerse: string): void {
    const split = singleOsisVerse.split('.');
    const osisParts: OsisParts = {
      bookId: split[0],
      chapter: parseInt(split[1]),
      verse: parseInt(split[2]),
    };
    let lastBookIndex: number = null;
    let lastChapterindex: number = null;

    const bookNumber = bibleInfo.order[osisParts.bookId];
    const bookName = bibleIndex.books[bookNumber - 1];

    // Push the book if there are no books in parsedQuote
    if (parsedQuote.books.length === 0) {
      parsedQuote.books.push({
        id: osisParts.bookId,
        num: bookNumber,
        name: bookName,
        chapters: [],
      });
    }
    // Push the book to parsedQuote only if it's different from the last pushed book pushed
    else {
      lastBookIndex = parsedQuote.books.length - 1;
      if (parsedQuote.books[lastBookIndex].id !== osisParts.bookId) {
        parsedQuote.books.push({
          id: osisParts.bookId,
          num: bookNumber,
          name: bookName,
          chapters: [],
        });
      }
    }
    lastBookIndex = parsedQuote.books.length - 1;

    // Push the chapter to the last book pushed if the book is empty
    if (parsedQuote.books[lastBookIndex].chapters.length === 0) {
      parsedQuote.books[lastBookIndex].chapters.push({
        id: osisParts.chapter,
        verses: [],
      });
    }
    // Push the chapter to the last book pushed only if it's different from the last pushed chapter
    else {
      lastChapterindex = parsedQuote.books[lastBookIndex].chapters.length - 1;
      if (parsedQuote.books[lastBookIndex].chapters[lastChapterindex].id !== osisParts[1]) {
        parsedQuote.books[lastBookIndex].chapters.push({
          id: osisParts.chapter,
          verses: [],
        });
      }
    }
    lastChapterindex = parsedQuote.books[lastBookIndex].chapters.length - 1;

    // Push the verse to the last chapter pushed
    parsedQuote.books[lastBookIndex].chapters[lastChapterindex].verses.push(osisParts.verse);
  }

  return parsedQuote;
}

/**
 * Gets the bcv parsed entities object andcreates a normalized citation text.
 * @param bvcParsedObject https://github.com/openbibleinfo/Bible-Passage-Reference-Parser#parsed_entities
 * @returns The normalized citation
 */
function osis2Cite(bvcParsedObject) {
  let citation = '';

  /*
	entity types:
	bcv		=>	Single verse
	bc		=>	Single chapter
	cv		=>	Can be preceded by (bcv || bc)
	integer	=>	Can be preceded by (bcv || bc || cv)
	range	=>	Can be preceded by (bcv || bc || cv || null)
	*/

  let lastType = null;
  let lastBook = null;
  let lastChap = null;

  for (let entity of bvcParsedObject.entities) {
    if (entity.type === 'bcv') {
      if (entity.start.b !== lastBook) {
        const bookName = bibleIndex.books[bibleInfo.books.indexOf(entity.start.b)];
        citation += ' ' + bookName + ' ' + entity.start.c + ':' + entity.start.v;
      } else {
        if (entity.start.c === lastChap) {
          citation += ',' + entity.start.v;
        } else {
          citation += ';' + entity.start.c + ':' + entity.start.v;
        }
      }

      lastType = 'v';
      lastBook = entity.start.b;
      lastChap = entity.start.c;
    } else if (entity.type === 'bc') {
      if (entity.start.b !== lastBook) {
        const bookName = bibleIndex.books[bibleInfo.books.indexOf(entity.start.b)];
        citation += ' ' + bookName + ' ' + entity.start.c;
      } else {
        citation += ';' + entity.start.c;
      }

      lastType = 'c';
      lastBook = entity.start.b;
      lastChap = entity.start.c;
    } else if (entity.type === 'cv') {
      if (entity.start.c !== lastChap) {
        citation += ';' + entity.start.c + ':' + entity.start.v;
      } else {
        citation += ',' + entity.start.v;
      }

      lastType = 'v';
      lastChap = entity.start.c;
    } else if (entity.type === 'integer') {
      if (lastType === 'v') {
        citation += ',' + entity.start.v;
      } else if (lastType === 'c') {
        citation += ';' + entity.start.c;
      }
    } else if (entity.type === 'range') {
      //Get the type of range
      let rangeType = null;
      if (entity.start.b !== entity.end.b) {
        rangeType = 'book';
      } else {
        if (entity.start.c !== entity.end.c) {
          rangeType = 'chap';
        } else {
          if (entity.start.v !== entity.end.v) {
            rangeType = 'verse';
          }
        }
      }

      const startEntityType = entity.start.type;
      const endEntityType = entity.end.type;

      if (rangeType === 'verse') {
        if (startEntityType === 'bcv') {
          if (entity.start.b !== lastBook) {
            const bookName = bibleIndex.books[bibleInfo.books.indexOf(entity.start.b)];
            citation += ' ' + bookName + ' ' + entity.start.c + ':' + entity.start.v;
          } else {
            citation += ',' + entity.start.v;
          }
          lastType = 'v';
        } else if (startEntityType === 'bc') {
          if (entity.start.b !== lastBook) {
            const bookName = bibleIndex.books[bibleInfo.books.indexOf(entity.start.b)];
            citation += ' ' + bookName + ' ' + entity.start.c + ':' + entity.start.v;
          } else {
            citation += ',' + entity.start.v;
          }
          lastType = 'v';
        } else if (startEntityType === 'cv') {
          if (entity.start.c !== lastChap) {
            citation += ';' + entity.start.c + ':' + entity.start.v;
          } else {
            citation += ',' + entity.start.v;
          }
          lastType = 'v';
        } else if (startEntityType === 'integer') {
          if (lastType === 'v') {
            citation += ',' + entity.start.v;
          } else if (lastType === 'c') {
            citation += ';' + entity.start.c;
          }
        } else {
          citation += 'not handled';
        }

        citation += '-' + entity.end.v;
        lastType = 'v';
      } else if (rangeType === 'chap') {
        if (startEntityType === 'bcv') {
          if (entity.start.b !== lastBook) {
            const bookName = bibleIndex.books[bibleInfo.books.indexOf(entity.start.b)];
            citation += ' ' + bookName + ' ' + entity.start.c + ':' + entity.start.v;
          } else {
            citation += ';' + entity.start.c + ':' + entity.start.v;
          }
          lastType = 'v';
        } else if (startEntityType === 'bc') {
          if (entity.start.b !== lastBook) {
            const bookName = bibleIndex.books[bibleInfo.books.indexOf(entity.start.b)];
            citation += ' ' + bookName + ' ' + entity.start.c;
          } else {
            citation += ';' + entity.start.c;
          }
          lastType = 'c';
        } else if (startEntityType === 'cv') {
          if (entity.start.c !== lastChap) {
            citation += ';' + entity.start.c + ':' + entity.start.v;
          } else {
            citation += ',' + entity.start.v;
          }
          lastType = 'v';
        } else if (startEntityType === 'integer') {
          if (lastType === 'v') {
            citation += ',' + entity.start.v;
          } else if (lastType === 'c') {
            citation += ';' + entity.start.c;
          }
        } else {
          citation += 'not handled';
        }

        citation += '-';

        if (endEntityType === 'bcv') {
          citation += entity.end.c + ':' + entity.end.v;
        } else if (endEntityType === 'bc') {
          citation += entity.end.c;
        } else if (endEntityType === 'cv') {
          citation += entity.end.c + ':' + entity.end.v;
        } else if (endEntityType === 'integer') {
          if (lastType === 'v') {
            citation += entity.end.v;
          } else if (lastType === 'c') {
            citation += entity.end.c;
          }
        } else {
          citation += 'not handled';
        }
      } else if (rangeType === 'book') {
        const startBookName = bibleIndex.books[bibleInfo.books.indexOf(entity.start.b)];
        const endBookName = bibleIndex.books[bibleInfo.books.indexOf(entity.end.b)];
        citation += ' ' + startBookName + ' ';

        if (startEntityType === 'bcv') {
          citation += entity.start.c + ':' + entity.start.v;
        } else if (startEntityType === 'bc') {
          citation += entity.start.c;
        } else if (startEntityType === 'cv') {
          citation += entity.start.c + ':' + entity.start.v;
        } else if (startEntityType === 'integer') {
          if (lastType === 'v') {
            citation += entity.start.c + ':' + entity.start.v;
          } else if (lastType === 'c') {
            citation += entity.start.c;
          }
        }

        citation += ' - ' + endBookName + ' ';

        if (endEntityType === 'bcv') {
          citation += entity.end.c + ':' + entity.end.v;
          lastType = 'v';
        } else if (endEntityType === 'bc') {
          citation += entity.end.c;
          lastType = 'c';
        } else {
          citation += 'not handled';
        }

        lastBook = null;
        lastChap = null;
      } else {
        citation += 'not a range';
      }
    }
  }

  return citation;
}
