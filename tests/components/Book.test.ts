// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import Book from '../../src/components/Book';

describe('Book', () => {
  it('renders chapters inside a book div', () => {
    const html = Book({
      chapters: ['<div>chapter 1 content</div>'],
      name: 'Genesis',
      displayName: false,
    });
    expect(html).toContain('chapter 1 content');
  });

  it('includes book name when displayName is true', () => {
    const html = Book({
      chapters: ['<div>content</div>'],
      name: 'Genesis',
      displayName: true,
    });
    expect(html).toContain('Genesis');
  });

  it('omits book name when displayName is false', () => {
    const html = Book({
      chapters: ['<div>content</div>'],
      name: 'Genesis',
      displayName: false,
    });
    expect(html).not.toContain('Genesis');
  });

  it('renders multiple chapters', () => {
    const html = Book({
      chapters: ['<div>ch1</div>', '<div>ch2</div>'],
      name: 'Gen',
      displayName: false,
    });
    expect(html).toContain('ch1');
    expect(html).toContain('ch2');
  });
});
