// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import Citation from '../../src/components/Citation';

describe('Citation', () => {
  it('renders books inside a citation div', () => {
    const html = Citation({
      books: ['<div>book content</div>'],
      citation: 'Gen 1:1',
      displayFullCitation: false,
      displayOsisIDWork: false,
      osisIDWork: '',
      style: {},
    });
    expect(html).toContain('book content');
  });

  it('includes full citation header when displayFullCitation is true', () => {
    const html = Citation({
      books: ['<div>content</div>'],
      citation: 'Gen 1:1',
      displayFullCitation: true,
      displayOsisIDWork: true,
      osisIDWork: 'KJV',
      style: {},
    });
    expect(html).toContain('Gen 1:1');
    expect(html).toContain('KJV');
  });

  it('omits full citation header when displayFullCitation is false', () => {
    const html = Citation({
      books: ['<div>content</div>'],
      citation: 'Gen 1:1',
      displayFullCitation: false,
      displayOsisIDWork: false,
      osisIDWork: '',
      style: {},
    });
    expect(html).not.toContain('Gen 1:1');
  });
});
