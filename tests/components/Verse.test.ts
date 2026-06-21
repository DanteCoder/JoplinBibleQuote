// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import Verse from '../../src/components/Verse';

describe('Verse', () => {
  it('renders verse text without number', () => {
    const html = Verse({ text: 'In the beginning...', number: 1, displayNumber: false });
    expect(html).toContain('In the beginning...');
    expect(html).not.toContain('1.');
  });

  it('renders verse text with number prefix', () => {
    const html = Verse({ text: 'And the earth was without form', number: 2, displayNumber: true });
    expect(html).toContain('2.');
    expect(html).toContain('And the earth was without form');
  });

  it('uses bq-verse class', () => {
    const html = Verse({ text: 'test', number: 1, displayNumber: false });
    expect(html).toContain('class="bq-verse"');
  });
});
