// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import FullCitation from '../../src/components/FullCitation';

describe('FullCitation', () => {
  it('renders citation text in h3', () => {
    const html = FullCitation({ citation: 'Genesis 1:1', displayOsisIDWork: false, osisIDWork: '' });
    expect(html).toContain('<h3');
    expect(html).toContain('Genesis 1:1');
  });

  it('includes OSIS ID when displayOsisIDWork is true', () => {
    const html = FullCitation({ citation: 'Genesis 1:1', displayOsisIDWork: true, osisIDWork: 'KJV' });
    expect(html).toContain('(KJV)');
  });

  it('omits OSIS ID when displayOsisIDWork is false', () => {
    const html = FullCitation({ citation: 'Genesis 1:1', displayOsisIDWork: false, osisIDWork: 'KJV' });
    expect(html).not.toContain('(KJV)');
  });

  it('omits empty b tags when citation is empty string', () => {
    const html = FullCitation({ citation: '', displayOsisIDWork: true, osisIDWork: 'NTV' });
    expect(html).not.toContain('<b></b>');
    expect(html).toContain('(NTV)');
  });
});
