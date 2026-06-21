import { describe, it, expect } from 'vitest';
import { parseQuote } from '../src/utils/parseQuote';
import { OsisObject } from '../src/interfaces/osisObject';
import { BibleLanguage, BibleInfo } from '../src/interfaces/bibleIndex';

const bibleIndex: BibleLanguage = {
  book: 'Book',
  chapter: 'Chapter',
  chapters: 'Chapters',
  verses: 'Verses',
  books: ['Genesis', 'Exodus'],
};

const bibleInfo: BibleInfo = {
  books: ['Gen', 'Exod'],
  chapters: {
    Gen: [31, 25, 24],
    Exod: [40, 30],
  },
  order: { Gen: 1, Exod: 2 },
};

describe('parseQuote', () => {
  it('parses a single verse into a ParsedQuote', () => {
    const osisObject: OsisObject = {
      osis: 'Gen.1.1',
      indices: [0, 8],
      translations: ['KJV'],
      entity_id: 0,
      entities: [
        {
          osis: 'Gen.1.1',
          type: 'bcv',
          indices: [0, 8],
          translations: ['KJV'],
          start: { b: 'Gen', c: 1, v: 1, type: 'bcv' },
          end: { b: 'Gen', c: 1, v: 1, type: 'bcv' },
          enclosed_indices: [0, 1],
          entity_id: 0,
          entities: [],
        },
      ],
    };
    const result = parseQuote(osisObject, bibleIndex, bibleInfo);
    expect(result.books).toHaveLength(1);
    expect(result.books[0].name).toBe('Genesis');
    expect(result.books[0].chapters).toHaveLength(1);
    expect(result.books[0].chapters[0].id).toBe(1);
    expect(result.books[0].chapters[0].verses).toEqual([1]);
  });

  it('parses a range spanning multiple verses', () => {
    const osisObject: OsisObject = {
      osis: 'Gen.1.1-Gen.1.3',
      indices: [0, 16],
      translations: ['KJV'],
      entity_id: 0,
      entities: [
        {
          osis: 'Gen.1.1-Gen.1.3',
          type: 'range',
          indices: [0, 16],
          translations: ['KJV'],
          start: { b: 'Gen', c: 1, v: 1, type: 'bcv' },
          end: { b: 'Gen', c: 1, v: 3, type: 'bcv' },
          enclosed_indices: [0, 1],
          entity_id: 0,
          entities: [],
        },
      ],
    };
    const result = parseQuote(osisObject, bibleIndex, bibleInfo);
    expect(result.books).toHaveLength(1);
    expect(result.books[0].chapters[0].verses).toEqual([1, 2, 3]);
  });

  it('includes a citation string', () => {
    const osisObject: OsisObject = {
      osis: 'Gen.1.1',
      indices: [0, 8],
      translations: ['KJV'],
      entity_id: 0,
      entities: [
        {
          osis: 'Gen.1.1',
          type: 'bcv',
          indices: [0, 8],
          translations: ['KJV'],
          start: { b: 'Gen', c: 1, v: 1, type: 'bcv' },
          end: { b: 'Gen', c: 1, v: 1, type: 'bcv' },
          enclosed_indices: [0, 1],
          entity_id: 0,
          entities: [],
        },
      ],
    };
    const result = parseQuote(osisObject, bibleIndex, bibleInfo);
    expect(result.cite).not.toBe('');
    expect(typeof result.cite).toBe('string');
  });
});
