import { describe, it, expect, vi, beforeEach } from 'vitest';
import { xmlBible2Js } from '../src/utils/xmlBible2Js';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

vi.mock('xml2js', () => ({
  parseString: vi.fn(),
}));

import * as fs from 'fs';
import { parseString } from 'xml2js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('xmlBible2Js', () => {
  it('returns parsed bible when file is valid', () => {
    vi.mocked(fs.readFileSync).mockReturnValue('<xml>content</xml>');
    vi.mocked(parseString).mockImplementation(((_xml: unknown, cb: (err: unknown, result: unknown) => void) => {
      (cb as (err: unknown, result: unknown) => void)(null, { bible: { book: 'Genesis' } });
    }) as never);

    const result = xmlBible2Js('/path/to/bible.xml');
    expect(result.parsedBible).toEqual({ bible: { book: 'Genesis' } });
    expect(result.errorMessage).toBeUndefined();
  });

  it('returns error when file is not found', () => {
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      const err = new Error('ENOENT') as NodeJS.ErrnoException;
      err.code = 'ENOENT';
      throw err;
    });

    const result = xmlBible2Js('/invalid/path.xml');
    expect(result.errorMessage).toContain('Invalid path');
  });

  it('returns error when path is a directory', () => {
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      const err = new Error('EISDIR') as NodeJS.ErrnoException;
      err.code = 'EISDIR';
      throw err;
    });

    const result = xmlBible2Js('/path/to/dir');
    expect(result.errorMessage).toContain('no selected path');
  });

  it('returns error when XML parsing fails', () => {
    vi.mocked(fs.readFileSync).mockReturnValue('<invalid>xml');
    vi.mocked(parseString).mockImplementation(((_xml: unknown, cb: (err: unknown, _result: unknown) => void) => {
      (cb as (err: unknown, _result: unknown) => void)(new Error('Parse error'), null);
    }) as never);

    const result = xmlBible2Js('/path/to/bible.xml');
    expect(result.errorMessage).toContain('Error opening the file');
  });

  it('returns generic error for unknown fs errors', () => {
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('Permission denied');
    });

    const result = xmlBible2Js('/path/to/bible.xml');
    expect(result.errorMessage).toBe('Error: Permission denied');
  });
});
