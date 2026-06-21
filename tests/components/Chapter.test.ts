// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import Chapter from '../../src/components/Chapter';

describe('Chapter', () => {
  it('renders verses inside a chapter div', () => {
    const html = Chapter({
      verses: ['<div>verse 1</div>', '<div>verse 2</div>'],
      text: 'Chapter',
      number: 1,
      displayChapter: false,
      style: {},
    });
    expect(html).toContain('verse 1');
    expect(html).toContain('verse 2');
  });

  it('includes chapter title when displayChapter is true', () => {
    const html = Chapter({
      verses: ['<div>verse 1</div>'],
      text: 'Chapter',
      number: 5,
      displayChapter: true,
      style: {},
    });
    expect(html).toContain('Chapter 5');
  });

  it('omits chapter title when displayChapter is false', () => {
    const html = Chapter({
      verses: ['<div>verse 1</div>'],
      text: 'Chapter',
      number: 5,
      displayChapter: false,
      style: {},
    });
    expect(html).not.toContain('Chapter 5');
  });

  it('uses bq-verse-flex class for verses container', () => {
    const html = Chapter({
      verses: ['<div>v1</div>'],
      text: 'Chapter',
      number: 1,
      displayChapter: false,
      style: {},
    });
    expect(html).toContain('class="bq-verse-flex"');
  });
});
