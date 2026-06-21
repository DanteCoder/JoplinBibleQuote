// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import ChapterTitle from '../../src/components/ChapterTitle';

describe('ChapterTitle', () => {
  it('renders chapter title with number', () => {
    const html = ChapterTitle({ number: 1, style: {}, text: 'Chapter' });
    expect(html).toContain('Chapter 1');
  });

  it('renders in h3 tag', () => {
    const html = ChapterTitle({ number: 2, style: {}, text: 'Chapitre' });
    expect(html).toContain('<h3');
    expect(html).toContain('Chapitre 2');
  });

  it('includes min-width style', () => {
    const html = ChapterTitle({ number: 1, style: { color: 'red' }, text: 'Chapter' });
    expect(html).toContain('min-width');
  });
});
