// @vitest-environment happy-dom

import { describe, it, expect, vi } from 'vitest';
import ParallelBlock from '../../src/components/ParallelBlock';

vi.mock('../../src/utils/parseQuote', () => ({
  parseQuote: () => ({
    books: [{ id: 'Gen', num: 1, name: 'Genesis', chapters: [{ id: 1, verses: [1, 2] }] }],
    cite: 'Genesis 1:1-2',
  }),
}));

vi.mock('../../src/components/ParallelVerses', () => ({
  default: () => '<div>ParallelVerses output</div>',
}));

const bibleIndex = { book: 'Book', chapter: 'Chapter', chapters: 'Chapters', verses: 'Verses', books: ['Genesis'] };
const bibleInfo = { books: ['Gen'], chapters: { Gen: [31] }, order: { Gen: 1 } };
const pluginConfig = { language: 'en', biblePath: '', biblesPath: '', verseFontSize: 16, verseAlignment: 'justify', bookAlignment: 'center', chapterAlignment: 'left', chapterPadding: 10 };

describe('ParallelBlock', () => {
  it('renders parallel citations', () => {
    const html = ParallelBlock({
      bibleIndex, bibleInfo, osisBibles: [],
      parsedEntity: { versions: ['KJV', 'RVR'], osisObjects: [{
        osis: 'Gen.1.1',
        indices: [0, 8],
        translations: ['KJV', 'RVR'],
        entity_id: 0,
        entities: [],
      }] },
      pluginConfig,
    });
    expect(html).toContain('Genesis 1:1-2');
    expect(html).toContain('KJV');
    expect(html).toContain('RVR');
    expect(html).toContain('ParallelVerses output');
  });

  it('uses grid layout', () => {
    const html = ParallelBlock({
      bibleIndex, bibleInfo, osisBibles: [],
      parsedEntity: { versions: ['KJV'], osisObjects: [{
        osis: 'Gen.1.1',
        indices: [0, 8],
        translations: ['KJV'],
        entity_id: 0,
        entities: [],
      }] },
      pluginConfig,
    });
    expect(html).toContain('grid');
  });
});
