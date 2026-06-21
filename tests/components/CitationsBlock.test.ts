// @vitest-environment happy-dom

import { describe, it, expect, vi } from 'vitest';
import CitationsBlock from '../../src/components/CitationsBlock';
import { BibleLanguage, BibleInfo } from '../../src/interfaces/bibleIndex';
import { PluginConfig } from '../../src/interfaces/config';
import { OsisBible } from '../../src/interfaces/osisBible';
import { ParsedEntity } from '../../src/interfaces/parseResult';

vi.mock('../../src/utils/getVerseText', () => ({
  getVerseText: () => 'mock verse text',
}));

vi.mock('../../src/utils/parseQuote', () => ({
  parseQuote: () => ({
    books: [
      {
        id: 'Gen',
        num: 1,
        name: 'Genesis',
        chapters: [{ id: 1, verses: [1, 2] }],
      },
    ],
    cite: 'Genesis 1:1-2',
  }),
}));

const bibleIndex: BibleLanguage = {
  book: 'Book', chapter: 'Chapter', chapters: 'Chapters', verses: 'Verses',
  books: ['Genesis', 'Exodus', 'Leviticus'],
};

const bibleInfo: BibleInfo = {
  books: ['Gen', 'Exod', 'Lev'],
  chapters: { Gen: [31], Exod: [40], Lev: [27] },
  order: { Gen: 1, Exod: 2, Lev: 3 },
};

const defaultOsisBible: OsisBible = {
  $: { osisIDWork: 'KJV' },
  div: [{
    $: { osisRefWork: 'Bible', osisIDWork: 'KJV', osisID: 'Gen' },
    chapter: [{
      $: { osisID: 'Gen.1' },
      verse: [
        { $: { osisID: 'Gen.1.1' }, _: 'In the beginning...' },
        { $: { osisID: 'Gen.1.2' }, _: 'And the earth...' },
      ],
    }],
  }],
};

const pluginConfig: PluginConfig = {
  language: 'en',
  biblePath: '/path/to/bible.xml',
  biblesPath: '/path/to/bibles',
  verseFontSize: 16,
  verseAlignment: 'justify',
  bookAlignment: 'center',
  chapterAlignment: 'left',
  chapterPadding: 10,
};

describe('CitationsBlock', () => {
  it('renders citations for a parsed entity', () => {
    const entity: ParsedEntity = {
      versions: ['default'],
      osisObjects: [{
        osis: 'Gen.1.1-Gen.1.2',
        indices: [0, 16],
        translations: ['KJV'],
        entity_id: 0,
        entities: [],
      }],
    };

    const html = CitationsBlock({ bibleIndex, bibleInfo, defaultOsisBible, entity, osisBibles: [defaultOsisBible], pluginConfig });
    expect(html).toContain('Genesis 1:1-2');
    expect(html).toContain('mock verse text');
    expect(html).toContain('KJV');
  });

  it('handles multiple entities', () => {
    const entity: ParsedEntity = {
      versions: ['default', 'KJV'],
      osisObjects: [
        {
          osis: 'Gen.1.1',
          indices: [0, 8],
          translations: ['KJV'],
          entity_id: 0,
          entities: [],
        },
      ],
    };

    const html = CitationsBlock({ bibleIndex, bibleInfo, defaultOsisBible, entity, osisBibles: [defaultOsisBible], pluginConfig });
    expect(html).toContain('KJV');
  });
});
