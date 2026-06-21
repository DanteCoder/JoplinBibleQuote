import { describe, it, expect } from 'vitest';
import { cssObj2String } from '../src/utils/cssObj2String';

describe('cssObj2String', () => {
  it('converts camelCase to kebab-case', () => {
    expect(cssObj2String({ fontSize: '16px' })).toBe('font-size: 16px;');
  });

  it('handles multiple properties', () => {
    const result = cssObj2String({ fontSize: '16px', textAlign: 'center' });
    expect(result).toContain('font-size: 16px;');
    expect(result).toContain('text-align: center;');
  });

  it('handles numeric values', () => {
    expect(cssObj2String({ padding: 30 })).toBe('padding: 30;');
  });

  it('returns empty string for empty object', () => {
    expect(cssObj2String({})).toBe('');
  });

  it('handles hyphenated properties correctly', () => {
    expect(cssObj2String({ minWidth: 'max-content' })).toBe('min-width: max-content;');
  });
});
