import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOsisBible } from '../src/utils/getOsisBible';

vi.mock('../src/utils/xmlBible2Js', () => ({
  xmlBible2Js: vi.fn(),
}));

import { xmlBible2Js } from '../src/utils/xmlBible2Js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getOsisBible', () => {
  it('returns osisBible when xmlBible2Js succeeds', () => {
    vi.mocked(xmlBible2Js).mockReturnValue({
      parsedBible: {
        osis: {
          osisText: [
            {
              $: { osisIDWork: 'KJV' },
              div: [{ $: { osisRefWork: 'Bible', osisIDWork: 'KJV', osisID: 'Gen' }, chapter: [] }],
            },
          ],
        },
      },
    });

    const result = getOsisBible('/path/to/bible.xml');
    expect(result.osisBible).toBeDefined();
    expect(result.osisBible!.$).toEqual({ osisIDWork: 'KJV' });
    expect(result.errorMessage).toBeUndefined();
  });

  it('returns error when xmlBible2Js returns error', () => {
    vi.mocked(xmlBible2Js).mockReturnValue({
      errorMessage: 'File not found',
    });

    const result = getOsisBible('/invalid/path.xml');
    expect(result.errorMessage).toBe('File not found');
    expect(result.osisBible).toBeUndefined();
  });

  it('returns error when parsedBible is missing osis structure', () => {
    vi.mocked(xmlBible2Js).mockReturnValue({
      parsedBible: { notOsis: true },
    });

    const result = getOsisBible('/path/to/bible.xml');
    expect(result.errorMessage).toContain('Error importing the xml file');
    expect(result.osisBible).toBeUndefined();
  });

  it('returns error when osis.osistext is empty', () => {
    vi.mocked(xmlBible2Js).mockReturnValue({
      parsedBible: {
        osis: {
          osisText: [],
        },
      },
    });

    const result = getOsisBible('/path/to/bible.xml');
    expect(result.errorMessage).toContain('Error importing the xml file');
  });
});
