import { describe, it, expect, vi, beforeEach } from 'vitest';
import { xmlBibleParser } from '../src/utils/xmlBibleParser';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

import * as fs from 'fs';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('xmlBibleParser', () => {
  it('returns parsed bible when file is valid', () => {
    vi.mocked(fs.readFileSync).mockReturnValue(`<?xml version="1.0"?>
<osis>
  <osisText osisIDWork="KJV">
    <div type="book" osisID="Gen">
      <chapter osisID="Gen.1">
        <verse osisID="Gen.1.1">In the beginning</verse>
      </chapter>
    </div>
  </osisText>
</osis>`);

    const result = xmlBibleParser('/path/to/bible.xml');
    expect(result.parsedBible).toEqual({
      osis: {
        osisText: [{
          $: { osisIDWork: 'KJV' },
          div: [{
            $: { type: 'book', osisID: 'Gen' },
            chapter: [{
              $: { osisID: 'Gen.1' },
              verse: [{
                $: { osisID: 'Gen.1.1' },
                _: 'In the beginning',
              }],
            }],
          }],
        }],
      },
    });
    expect(result.errorMessage).toBeUndefined();
  });

  it('returns error when file is not found', () => {
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      const err = new Error('ENOENT') as NodeJS.ErrnoException;
      err.code = 'ENOENT';
      throw err;
    });

    const result = xmlBibleParser('/invalid/path.xml');
    expect(result.errorMessage).toContain('Invalid path');
  });

  it('returns error when path is a directory', () => {
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      const err = new Error('EISDIR') as NodeJS.ErrnoException;
      err.code = 'EISDIR';
      throw err;
    });

    const result = xmlBibleParser('/path/to/dir');
    expect(result.errorMessage).toContain('no selected path');
  });

  it('returns error when XML parsing fails', () => {
    vi.mocked(fs.readFileSync).mockReturnValue('<invalid>xml');

    const result = xmlBibleParser('/path/to/bible.xml');
    expect(result.errorMessage).toContain('Error opening the file');
  });

  it('returns generic error for unknown fs errors', () => {
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('Permission denied');
    });

    const result = xmlBibleParser('/path/to/bible.xml');
    expect(result.errorMessage).toBe('Error: Permission denied');
  });
});
