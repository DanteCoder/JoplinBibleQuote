// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import BookName from '../../src/components/BookName';

describe('BookName', () => {
  it('renders book name in an h2 tag', () => {
    const html = BookName({ name: 'Genesis', style: {} });
    expect(html).toContain('<h2');
    expect(html).toContain('Genesis');
    expect(html).toContain('</h2>');
  });

  it('includes bq-book-name class', () => {
    const html = BookName({ name: 'Genesis', style: { fontSize: '16px' } });
    expect(html).toContain('class="bq-book-name"');
  });
});
