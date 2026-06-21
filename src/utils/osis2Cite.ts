import { BibleInfo, BibleLanguage } from 'src/interfaces/bibleIndex';
import { OsisEntity, OsisEntityStart, OsisObject } from 'src/interfaces/osisObject';

interface Cursor {
  lastType: string | null;
  lastBook: string | null;
  lastChap: number | null;
}

export function osis2Cite(osisObject: OsisObject, bibleIndex: BibleLanguage, bibleInfo: BibleInfo): string {
  let citation = '';
  let cursor: Cursor = { lastType: null, lastBook: null, lastChap: null };

  for (const entity of osisObject.entities) {
    const result = processEntity(entity, cursor, bibleIndex, bibleInfo);
    citation += result.text;
    cursor = result.cursor;
  }

  return citation;
}

function processEntity(
  entity: OsisEntity,
  cursor: Cursor,
  bibleIndex: BibleLanguage,
  bibleInfo: BibleInfo
): { text: string; cursor: Cursor } {
  if (entity.type === 'range') return processRange(entity, cursor, bibleIndex, bibleInfo);

  return processSimple(entity, cursor, bibleIndex, bibleInfo);
}

function processSimple(
  entity: OsisEntity,
  cursor: Cursor,
  bibleIndex: BibleLanguage,
  bibleInfo: BibleInfo
): { text: string; cursor: Cursor } {
  const { b, c, v, type } = entity.start;
  const result = formatStart(type, b, c, v, cursor, bibleIndex, bibleInfo);

  return { text: result.text, cursor: { ...cursor, ...result.cursor } };
}

function processRange(
  entity: OsisEntity,
  cursor: Cursor,
  bibleIndex: BibleLanguage,
  bibleInfo: BibleInfo
): { text: string; cursor: Cursor } {
  if (entity.start.b !== entity.end.b) {
    return processBookRange(entity, cursor, bibleIndex, bibleInfo);
  }

  if (entity.start.c !== entity.end.c) {
    return processChapRange(entity, cursor, bibleIndex, bibleInfo);
  }

  return processVerseRange(entity, cursor, bibleIndex, bibleInfo);
}

function processVerseRange(
  entity: OsisEntity,
  cursor: Cursor,
  bibleIndex: BibleLanguage,
  bibleInfo: BibleInfo
): { text: string; cursor: Cursor } {
  const startType = entity.start.type;
  const { b, c, v } = entity.start;
  let text: string;

  if (startType === 'bcv' || startType === 'bc') {
    if (b !== cursor.lastBook) {
      text = ' ' + getBookName(b, bibleIndex, bibleInfo) + ' ' + c + ':' + v;
    } else {
      text = ',' + v;
    }
  } else if (startType === 'cv') {
    text = c !== cursor.lastChap ? ';' + c + ':' + v : ',' + v;
  } else {
    text = appendInteger('', cursor.lastType, c, v);
  }

  text += '-' + entity.end.v;

  return { text, cursor: { lastType: 'v', lastBook: b, lastChap: c } };
}

function processChapRange(
  entity: OsisEntity,
  cursor: Cursor,
  bibleIndex: BibleLanguage,
  bibleInfo: BibleInfo
): { text: string; cursor: Cursor } {
  const startType = entity.start.type;
  const endType = entity.end.type;
  const { b, c, v } = entity.start;
  let text: string;
  let lastType: string | null;

  if (startType === 'bcv') {
    if (b !== cursor.lastBook) {
      text = ' ' + getBookName(b, bibleIndex, bibleInfo) + ' ' + c + ':' + v;
    } else {
      text = ';' + c + ':' + v;
    }

    lastType = 'v';
  } else if (startType === 'bc') {
    if (b !== cursor.lastBook) {
      text = ' ' + getBookName(b, bibleIndex, bibleInfo) + ' ' + c;
    } else {
      text = ';' + c;
    }

    lastType = 'c';
  } else if (startType === 'cv') {
    text = c !== cursor.lastChap ? ';' + c + ':' + v : ',' + v;
    lastType = 'v';
  } else {
    text = appendInteger('', cursor.lastType, c, v);
    lastType = cursor.lastType;
  }

  text += '-';
  text += formatEndRef(endType, entity.end, lastType);

  const endLastType = typeToLastType(endType, lastType);

  return { text, cursor: { lastType: endLastType, lastBook: b, lastChap: c } };
}

function processBookRange(
  entity: OsisEntity,
  cursor: Cursor,
  bibleIndex: BibleLanguage,
  bibleInfo: BibleInfo
): { text: string; cursor: Cursor } {
  const startType = entity.start.type;
  const endType = entity.end.type;
  const startBookName = getBookName(entity.start.b, bibleIndex, bibleInfo);
  const endBookName = getBookName(entity.end.b, bibleIndex, bibleInfo);

  let text = ' ' + startBookName + ' ';
  text += formatRef(startType, entity.start);

  text += ' - ' + endBookName + ' ';

  if (endType === 'bcv') {
    text += entity.end.c + ':' + entity.end.v;
  } else if (endType === 'bc') {
    text += entity.end.c;
  }

  return { text, cursor: { lastType: null, lastBook: null, lastChap: null } };
}

function formatStart(
  type: OsisEntityStart['type'],
  b: string,
  c: number,
  v: number,
  cursor: Cursor,
  bibleIndex: BibleLanguage,
  bibleInfo: BibleInfo
): { text: string; cursor: Partial<Cursor> } {
  if (type === 'bcv') {
    if (b !== cursor.lastBook) {
      const bookName = getBookName(b, bibleIndex, bibleInfo);

      return { text: ' ' + bookName + ' ' + c + ':' + v, cursor: { lastType: 'v', lastBook: b, lastChap: c } };
    }

    if (c === cursor.lastChap) {
      return { text: ',' + v, cursor: { lastType: 'v' } };
    }

    return { text: ';' + c + ':' + v, cursor: { lastType: 'v', lastChap: c } };
  }

  if (type === 'bc') {
    if (b !== cursor.lastBook) {
      const bookName = getBookName(b, bibleIndex, bibleInfo);

      return { text: ' ' + bookName + ' ' + c, cursor: { lastType: 'c', lastBook: b, lastChap: c } };
    }

    return { text: ';' + c, cursor: { lastType: 'c', lastChap: c } };
  }

  if (type === 'cv') {
    if (c !== cursor.lastChap) {
      return { text: ';' + c + ':' + v, cursor: { lastType: 'v', lastChap: c } };
    }

    return { text: ',' + v, cursor: { lastType: 'v' } };
  }

  if (type === 'integer') {
    return { text: appendInteger('', cursor.lastType, c, v), cursor: {} };
  }

  return { text: '', cursor: {} };
}

function formatRef(type: OsisEntityStart['type'], ref: OsisEntityStart): string {
  if (type === 'bcv') return ref.c + ':' + ref.v;
  if (type === 'bc') return String(ref.c);
  if (type === 'cv') return ref.c + ':' + ref.v;
  if (type === 'integer') return '';

  return '';
}

function formatEndRef(type: OsisEntityStart['type'], ref: OsisEntityStart, lastType: string | null): string {
  if (type === 'bcv') return ref.c + ':' + ref.v;
  if (type === 'bc') return String(ref.c);
  if (type === 'cv') return ref.c + ':' + ref.v;
  if (type === 'integer') {
    if (lastType === 'v') return String(ref.v);
    if (lastType === 'c') return String(ref.c);
  }

  return '';
}

function typeToLastType(type: OsisEntityStart['type'], fallback: string | null): string | null {
  if (type === 'bcv' || type === 'cv') return 'v';
  if (type === 'bc') return 'c';

  return fallback;
}

function appendInteger(citation: string, lastType: string | null, c: number, v: number): string {
  if (lastType === 'v') return citation + ',' + v;
  if (lastType === 'c') return citation + ';' + c;

  return citation;
}

function getBookName(b: string, bibleIndex: BibleLanguage, bibleInfo: BibleInfo): string {
  return bibleIndex.books[bibleInfo.books.indexOf(b)];
}
