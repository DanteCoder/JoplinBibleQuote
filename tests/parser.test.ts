import { describe, it, expect, vi } from 'vitest';
import defaultParser from '../src/parser';
import { BcvParser } from '../src/parser';
import { BibleInfo } from '../src/interfaces/bibleIndex';

function createMockBcvParser(): BcvParser {
  let osisResult = '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsedEntitiesResult: any[] = [];

  return {
    translation_info(): BibleInfo {
      return {
        books: ['Gen', 'Exod', 'Lev', 'Num', 'Deut'],
        chapters: {
          Gen: [31, 25, 24],
          Exod: [40, 30],
          Lev: [27],
          Num: [36],
          Deut: [34],
        },
        order: { Gen: 1, Exod: 2, Lev: 3, Num: 4, Deut: 5 },
      };
    },
    set_options(_options: Record<string, string>) {},
    parse(input: string) {
      if (input.includes('Genesis') || input.includes('Gen')) {
        osisResult = 'Gen.1.1';
        parsedEntitiesResult = [{
          osis: 'Gen.1.1',
          entities: [{
            start: { b: 'Gen', c: 1, v: 1 },
            end: { b: 'Gen', c: 1, v: 1 },
          }],
        }];
      } else {
        osisResult = '';
        parsedEntitiesResult = [];
      }
      return {
        osis: () => osisResult,
        parsed_entities: () => parsedEntitiesResult,
      };
    },
  };
}

const availableVersions = ['KJV', 'RVR', 'NTV'];

describe('parser', () => {
  it('parses a valid citation line', () => {
    const result = defaultParser('(Genesis 1:1)', createMockBcvParser(), availableVersions);
    expect(result.type).toBe('entities');
    if (result.type === 'entities' && result.entities) {
      expect(result.entities).toHaveLength(1);
      expect(result.entities[0].osisObjects).toHaveLength(1);
    }
  });

  it('returns error for invalid citation', () => {
    const bcvParser = createMockBcvParser();
    vi.spyOn(bcvParser, 'parse').mockReturnValue({
      osis: () => '',
      parsed_entities: () => [],
    });
    const result = defaultParser('(InvalidCitation)', bcvParser, availableVersions);
    expect(result.type).toBe('error');
  });

  it('returns help type for help command', () => {
    const result = defaultParser('help', createMockBcvParser(), availableVersions);
    expect(result.type).toBe('help');
  });

  it('returns index type for index command', () => {
    const result = defaultParser('index', createMockBcvParser(), availableVersions);
    expect(result.type).toBe('index');
  });

  it('returns index with bookId for index Gen command', () => {
    const result = defaultParser('index Gen', createMockBcvParser(), availableVersions);
    expect(result.type).toBe('index');
    if (result.type === 'index') {
      expect(result.bookId).toBe('Gen');
    }
  });

  it('handles version command', () => {
    const result = defaultParser('version "KJV"\n(Genesis 1:1)', createMockBcvParser(), availableVersions);
    expect(result.type).toBe('entities');
  });

  it('returns error for invalid version', () => {
    const result = defaultParser('version "INVALID"', createMockBcvParser(), availableVersions);
    expect(result.type).toBe('error');
  });

  it('handles versions command', () => {
    const result = defaultParser('versions "KJV", "RVR"\n(Genesis 1:1)', createMockBcvParser(), ['KJV', 'RVR']);
    expect(result.type).toBe('entities');
  });

  it('handles versions with parallel flag', () => {
    const result = defaultParser('versions "KJV", "RVR" par\n(Genesis 1:1)', createMockBcvParser(), ['KJV', 'RVR']);
    expect(result.type).toBe('entities');
    if (result.type === 'entities' && result.entities) {
      expect(result.entities[0].options?.parallel).toBe(true);
    }
  });

  it('returns error for invalid syntax', () => {
    const result = defaultParser('garbage input', createMockBcvParser(), availableVersions);
    expect(result.type).toBe('error');
  });

  it('returns error when no citation specified', () => {
    const result = defaultParser('', createMockBcvParser(), availableVersions);
    expect(result.type).toBe('error');
  });

  it('returns error for invalid index book', () => {
    const result = defaultParser('index InvalidBookID', createMockBcvParser(), availableVersions);
    expect(result.type).toBe('error');
  });

  it('handles versions with duplicate versions', () => {
    const result = defaultParser('versions "KJV", "KJV"\n(Genesis 1:1)', createMockBcvParser(), ['KJV']);
    expect(result.type).toBe('entities');
  });
});
