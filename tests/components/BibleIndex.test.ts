// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import BibleIndex from '../../src/components/BibleIndex';

const bibleIndex = {
  book: 'Book',
  chapter: 'Chapter',
  chapters: 'Chapters',
  verses: 'Verses',
  books: ['Genesis', 'Exodus', 'Leviticus'],
};

const bibleInfo = {
  books: ['Gen', 'Exod', 'Lev'],
  chapters: {
    Gen: [31, 25, 24],
    Exod: [40, 30],
    Lev: [27],
  },
  order: { Gen: 1, Exod: 2, Lev: 3 },
};

describe('BibleIndex', () => {
  it('renders full book index when no bookId', () => {
    const html = BibleIndex({ bibleIndex, bibleInfo });
    expect(html).toContain('Book');
    expect(html).toContain('Chapters');
    expect(html).toContain('OSIS ID');
    expect(html).toContain('Genesis');
    expect(html).toContain('Gen');
  });

  it('renders chapter details when bookId is specified', () => {
    const html = BibleIndex({ bibleIndex, bibleInfo, bookId: 'Gen' });
    expect(html).toContain('Genesis');
    expect(html).toContain('Chapter');
    expect(html).toContain('Verses');
    expect(html).toContain('31');
    expect(html).toContain('25');
    expect(html).toContain('24');
  });

  it('includes index classes', () => {
    const html = BibleIndex({ bibleIndex, bibleInfo });
    expect(html).toContain('class="bq-block bq-index"');
  });
});
