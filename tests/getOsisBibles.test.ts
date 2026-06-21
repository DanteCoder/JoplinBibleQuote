import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOsisBibles } from '../src/utils/getOsisBibles';

vi.mock('fs', () => ({
  readdirSync: vi.fn(),
}));

vi.mock('../src/utils/getOsisBible', () => ({
  getOsisBible: vi.fn(),
}));

import * as fs from 'fs';
import { getOsisBible } from '../src/utils/getOsisBible';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getOsisBibles', () => {
  it('returns array of parsed OsisBibles from xml files', () => {
    vi.mocked(fs.readdirSync).mockReturnValue([
      { name: 'kjv.xml', isFile: () => true } as fs.Dirent,
      { name: 'rvr.xml', isFile: () => true } as fs.Dirent,
    ]);

    vi.mocked(getOsisBible)
      .mockReturnValueOnce({ osisBible: { $: { osisIDWork: 'KJV' }, div: [] } })
      .mockReturnValueOnce({ osisBible: { $: { osisIDWork: 'RVR' }, div: [] } });

    const result = getOsisBibles('/path/to/bibles');
    expect(result).toHaveLength(2);
    expect(result[0].$.osisIDWork).toBe('KJV');
    expect(result[1].$.osisIDWork).toBe('RVR');
  });

  it('skips files with errors', () => {
    vi.mocked(fs.readdirSync).mockReturnValue([
      { name: 'kjv.xml', isFile: () => true } as fs.Dirent,
      { name: 'invalid.xml', isFile: () => true } as fs.Dirent,
    ]);

    vi.mocked(getOsisBible)
      .mockReturnValueOnce({ osisBible: { $: { osisIDWork: 'KJV' }, div: [] } })
      .mockReturnValueOnce({ errorMessage: 'Invalid file' });

    const result = getOsisBibles('/path/to/bibles');
    expect(result).toHaveLength(1);
    expect(result[0].$.osisIDWork).toBe('KJV');
  });

  it('filters to only xml files', () => {
    vi.mocked(fs.readdirSync).mockReturnValue([
      { name: 'bible.xml', isFile: () => true } as fs.Dirent,
      { name: 'notes.txt', isFile: () => true } as fs.Dirent,
      { name: 'data.json', isFile: () => true } as fs.Dirent,
    ]);

    vi.mocked(getOsisBible).mockReturnValue({ osisBible: { $: { osisIDWork: 'KJV' }, div: [] } });

    getOsisBibles('/path/to/bibles');
    expect(getOsisBible).toHaveBeenCalledTimes(1);
  });

  it('returns empty array on readdir error', () => {
    vi.mocked(fs.readdirSync).mockImplementation(() => {
      throw new Error('ENOENT');
    });

    expect(() => getOsisBibles('/invalid/path')).toThrow();
  });
});
