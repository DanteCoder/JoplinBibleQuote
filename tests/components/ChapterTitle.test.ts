// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import ChapterTitle from '../../src/components/ChapterTitle';

describe('ChapterTitle', () => {
  it('renders chapter title with number', () => {
    const html = ChapterTitle({ number: 1, text: 'Chapter' });
    expect(html).toContain('Chapter 1');
  });

  it('renders in h3 tag', () => {
    const html = ChapterTitle({ number: 2, text: 'Chapitre' });
    expect(html).toContain('<h3');
    expect(html).toContain('Chapitre 2');
  });

  it('includes bq-chapter-title class', () => {
    const html = ChapterTitle({ number: 1, text: 'Chapter' });
    expect(html).toContain('class="bq-chapter-title"');
  });
});
