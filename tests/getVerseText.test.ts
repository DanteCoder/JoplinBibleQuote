import { describe, it, expect } from 'vitest';
import { getVerseText } from '../src/utils/getVerseText';
import { OsisBible } from '../src/interfaces/osisBible';
import { BCV } from '../src/interfaces/osisObject';

const mockBible: OsisBible = {
  $: { osisIDWork: 'KJV' },
  div: [
    {
      $: { osisRefWork: 'Bible', osisIDWork: 'KJV', osisID: 'Gen' },
      chapter: [
        {
          $: { osisID: 'Gen.1' },
          verse: [
            { $: { osisID: 'Gen.1.1' }, _: 'In the beginning God created the heaven and the earth.' },
            { $: { osisID: 'Gen.1.2' }, _: 'And the earth was without form, and void; and darkness was upon the face of the deep.' },
          ],
        },
        {
          $: { osisID: 'Gen.2' },
          verse: [
            { $: { osisID: 'Gen.2.1' }, _: 'Thus the heavens and the earth were finished, and all the host of them.' },
          ],
        },
      ],
    },
  ],
};

describe('getVerseText', () => {
  const bcv: BCV = { b: 'Gen', c: 1, v: 1 };

  it('returns verse text for a valid BCV', () => {
    const result = getVerseText(mockBible, bcv);
    expect(result).toBe('In the beginning God created the heaven and the earth.');
  });

  it('trims whitespace from verse text', () => {
    const bible: OsisBible = {
      $: { osisIDWork: 'KJV' },
      div: [
        {
          $: { osisRefWork: 'Bible', osisIDWork: 'KJV', osisID: 'Gen' },
          chapter: [
            {
              $: { osisID: 'Gen.1' },
              verse: [{ $: { osisID: 'Gen.1.1' }, _: '  spaced text  ' }],
            },
          ],
        },
      ],
    };
    expect(getVerseText(bible, { b: 'Gen', c: 1, v: 1 })).toBe('spaced text');
  });

  it('replaces newline-space patterns', () => {
    const bible: OsisBible = {
      $: { osisIDWork: 'KJV' },
      div: [
        {
          $: { osisRefWork: 'Bible', osisIDWork: 'KJV', osisID: 'Gen' },
          chapter: [
            {
              $: { osisID: 'Gen.1' },
              verse: [{ $: { osisID: 'Gen.1.1' }, _: 'line1\n line2' }],
            },
          ],
        },
      ],
    };
    const result = getVerseText(bible, { b: 'Gen', c: 1, v: 1 });
    expect(result).toContain('<br>');
  });

  it('normalizes whitespace', () => {
    const bible: OsisBible = {
      $: { osisIDWork: 'KJV' },
      div: [
        {
          $: { osisRefWork: 'Bible', osisIDWork: 'KJV', osisID: 'Gen' },
          chapter: [
            {
              $: { osisID: 'Gen.1' },
              verse: [{ $: { osisID: 'Gen.1.1' }, _: 'word1   word2' }],
            },
          ],
        },
      ],
    };
    expect(getVerseText(bible, { b: 'Gen', c: 1, v: 1 })).toBe('word1 word2');
  });
});
