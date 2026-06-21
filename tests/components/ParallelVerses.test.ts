// @vitest-environment happy-dom

import { describe, it, expect, vi } from 'vitest';
import ParallelVerses from '../../src/components/ParallelVerses';

vi.mock('../../src/utils/getVerseText', () => ({
  getVerseText: () => 'mock verse text',
}));

vi.mock('../../src/components/Verse', () => ({
  default: ({ number }: { number: number }) => `<div>verse ${number}</div>`,
}));

const osisBibles = [
  {
    $: { osisIDWork: 'KJV' },
    div: [{
      $: { osisRefWork: 'Bible', osisIDWork: 'KJV', osisID: 'Gen' },
      chapter: [{ $: { osisID: 'Gen.1' }, verse: [{ $: { osisID: 'Gen.1.1' }, _: 'KJV text' }, { $: { osisID: 'Gen.1.2' }, _: 'KJV verse 2' }] }],
    }],
  },
  {
    $: { osisIDWork: 'RVR' },
    div: [{
      $: { osisRefWork: 'Bible', osisIDWork: 'RVR', osisID: 'Gen' },
      chapter: [{ $: { osisID: 'Gen.1' }, verse: [{ $: { osisID: 'Gen.1.1' }, _: 'RVR text' }, { $: { osisID: 'Gen.1.2' }, _: 'RVR verse 2' }] }],
    }],
  },
];

describe('ParallelVerses', () => {
  it('renders verses for each version', () => {
    const html = ParallelVerses({
      bookId: 'Gen',
      chapter: { id: 1, verses: [1, 2] },
      osisBibles,
      versions: ['KJV', 'RVR'],
    });
    expect(html).toContain('verse 1');
    expect(html).toContain('verse 2');
  });

  it('uses parallel grid class', () => {
    const html = ParallelVerses({
      bookId: 'Gen',
      chapter: { id: 1, verses: [1] },
      osisBibles,
      versions: ['KJV'],
    });
    expect(html).toContain('class="bq-parallel-grid"');
  });
});
