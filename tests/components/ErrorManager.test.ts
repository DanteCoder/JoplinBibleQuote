// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import ErrorManager from '../../src/components/ErrorManager';

describe('ErrorManager', () => {
  it('renders error message in a div', () => {
    const html = ErrorManager('Something went wrong');
    expect(html).toContain('Something went wrong');
  });

  it('replaces newlines with <br>', () => {
    const html = ErrorManager('line1\nline2');
    expect(html).toContain('line1<br>line2');
  });

  it('includes red border styling', () => {
    const html = ErrorManager('error');
    expect(html).toContain('red');
    expect(html).toContain('border');
  });
});
