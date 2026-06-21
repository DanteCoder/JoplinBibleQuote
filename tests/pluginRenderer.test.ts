// @vitest-environment happy-dom

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderBibleBlock } from '../src/utils/pluginRenderer';

vi.mock('../src/parser', () => ({
  default: vi.fn(),
  BcvParser: vi.fn(),
}));

vi.mock('../src/utils/getOsisBible', () => ({
  getOsisBible: vi.fn(),
}));

vi.mock('../src/utils/getOsisBibles', () => ({
  getOsisBibles: vi.fn(),
}));

vi.mock('../src/components/Help', () => ({
  default: vi.fn().mockReturnValue('<div>Help content</div>'),
}));

vi.mock('../src/components/ErrorManager', () => ({
  default: vi.fn().mockReturnValue('<div>Error content</div>'),
}));

vi.mock('../src/components/BibleIndex', () => ({
  default: vi.fn().mockReturnValue('<div>Index content</div>'),
}));

vi.mock('../src/components/Main', () => ({
  default: vi.fn().mockReturnValue('<div>Main rendered content</div>'),
}));

import parser from '../src/parser';
import { getOsisBible } from '../src/utils/getOsisBible';
import { getOsisBibles } from '../src/utils/getOsisBibles';

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getOsisBible).mockReturnValue({
    osisBible: { $: { osisIDWork: 'KJV' }, div: [] },
  });
  vi.mocked(getOsisBibles).mockReturnValue([
    { $: { osisIDWork: 'KJV' }, div: [] },
    { $: { osisIDWork: 'RVR' }, div: [] },
  ]);
});

const config = {
  language: 'en',
  biblePath: '/path/to/bible.xml',
  biblesPath: '/path/to/bibles',
  verseFontSize: 16,
  verseAlignment: 'justify',
  bookAlignment: 'center',
  chapterAlignment: 'left',
  chapterPadding: 10,
};

describe('renderBibleBlock', () => {
  it('returns error HTML when getOsisBible fails', () => {
    vi.mocked(getOsisBible).mockReturnValue({ errorMessage: 'File not found' });

    const result = renderBibleBlock('(Genesis 1:1)', config);
    expect(result).toContain('Error content');
  });

  it('returns help HTML for help commands', () => {
    vi.mocked(parser).mockReturnValue({ type: 'help' });

    const result = renderBibleBlock('help', config);
    expect(result).toContain('Help content');
  });

  it('returns index HTML for index commands', () => {
    vi.mocked(parser).mockReturnValue({ type: 'index' });

    const result = renderBibleBlock('index', config);
    expect(result).toContain('Index content');
  });

  it('returns index HTML for specific book index', () => {
    vi.mocked(parser).mockReturnValue({ type: 'index', bookId: 'Gen' });

    const result = renderBibleBlock('index Gen', config);
    expect(result).toContain('Index content');
  });

  it('returns rendered main HTML for valid citations', () => {
    vi.mocked(parser).mockReturnValue({
      type: 'entities',
      entities: [{ versions: ['default'], osisObjects: [] }],
    });

    const result = renderBibleBlock('(Genesis 1:1)', config);
    expect(result).toContain('Main rendered content');
  });

  it('returns error HTML for parser errors', () => {
    vi.mocked(parser).mockReturnValue({ type: 'error', errorMessage: 'Invalid citation' });

    const result = renderBibleBlock('invalid', config);
    expect(result).toContain('Error content');
  });
});
