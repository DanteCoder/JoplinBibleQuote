// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import Help from '../../src/components/Help';

describe('Help', () => {
  it('renders help text for English', () => {
    const html = Help({ language: 'en' });
    expect(html).toContain('Available commands');
  });

  it('falls back to English for unknown language', () => {
    const html = Help({ language: 'unknown' });
    expect(html).toContain('Available commands');
  });

  it('includes help classes', () => {
    const html = Help({ language: 'en' });
    expect(html).toContain('class="bq-block bq-help"');
  });
});
