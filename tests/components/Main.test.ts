// @vitest-environment happy-dom

import { describe, it, expect, vi } from 'vitest';
import Main from '../../src/components/Main';

vi.mock('../../src/components/CitationsBlock', () => ({
  default: () => '<div>CitationsBlock output</div>',
}));

vi.mock('../../src/components/ParallelBlock', () => ({
  default: () => '<div>ParallelBlock output</div>',
}));

vi.mock('../../src/utils/createHtml', () => ({
  createHtml: vi.fn((tag, content) => `<${tag}>${content}</${tag}>`),
}));

const bibleIndex = { book: 'Book', chapter: 'Chapter', chapters: 'Chapters', verses: 'Verses', books: ['Genesis'] };
const bibleInfo = { books: ['Gen'], chapters: { Gen: [31] }, order: { Gen: 1 } };
const defaultOsisBible = { $: { osisIDWork: 'KJV' }, div: [] };
const pluginConfig = { language: 'en', biblePath: '', biblesPath: '', verseFontSize: 16, verseAlignment: 'justify', bookAlignment: 'center', chapterAlignment: 'left', chapterPadding: 10 };

describe('Main', () => {
  it('renders CitationsBlock for non-parallel entities', () => {
    const html = Main({
      bibleIndex, bibleInfo, defaultOsisBible, osisBibles: [],
      parsedEntities: [{ versions: ['default'], osisObjects: [] }],
      pluginConfig,
    });
    expect(html).toContain('CitationsBlock output');
  });

  it('renders ParallelBlock for parallel entities', () => {
    const html = Main({
      bibleIndex, bibleInfo, defaultOsisBible, osisBibles: [],
      parsedEntities: [{ versions: ['KJV', 'RVR'], osisObjects: [], options: { parallel: true } }],
      pluginConfig,
    });
    expect(html).toContain('ParallelBlock output');
  });

  it('renders wrapper with content', () => {
    const html = Main({
      bibleIndex, bibleInfo, defaultOsisBible, osisBibles: [],
      parsedEntities: [{ versions: ['default'], osisObjects: [] }],
      pluginConfig,
    });
    expect(html).toContain('CitationsBlock output');
  });
});
