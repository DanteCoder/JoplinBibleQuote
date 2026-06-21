import { describe, it, expect } from 'vitest';
import { osis2Cite } from '../src/utils/osis2Cite';
import { OsisObject } from '../src/interfaces/osisObject';
import { BibleLanguage, BibleInfo } from '../src/interfaces/bibleIndex';

const bibleIndex: BibleLanguage = {
  book: 'Book',
  chapter: 'Chapter',
  chapters: 'Chapters',
  verses: 'Verses',
  books: ['Genesis', 'Exodus', 'Leviticus'],
};

const bibleInfo: BibleInfo = {
  books: ['Gen', 'Exod', 'Lev'],
  chapters: {
    Gen: [31, 25, 24],
    Exod: [40, 30],
    Lev: [27],
  },
  order: { Gen: 1, Exod: 2, Lev: 3 },
};

describe('osis2Cite', () => {
  it('formats a single bcv entity', () => {
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
    const result = osis2Cite(osisObject, bibleIndex, bibleInfo);
    expect(result).toContain('Genesis');
    expect(result).toContain('1:1');
  });

  it('formats a range of verses within same chapter', () => {
    const osisObject: OsisObject = {
      osis: 'Gen.1.1-Gen.1.5',
      indices: [0, 16],
      translations: ['KJV'],
      entity_id: 0,
      entities: [
        {
          osis: 'Gen.1.1-Gen.1.5',
          type: 'range',
          indices: [0, 16],
          translations: ['KJV'],
          start: { b: 'Gen', c: 1, v: 1, type: 'bcv' },
          end: { b: 'Gen', c: 1, v: 5, type: 'bcv' },
          enclosed_indices: [0, 1],
          entity_id: 0,
          entities: [],
        },
      ],
    };
    const result = osis2Cite(osisObject, bibleIndex, bibleInfo);
    expect(result).toContain('Genesis');
    expect(result).toContain('1:1-5');
  });
});
