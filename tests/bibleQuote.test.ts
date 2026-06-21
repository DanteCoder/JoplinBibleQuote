import { describe, it, expect, vi, beforeEach } from 'vitest';
import { init } from '../src/bibleQuote';

vi.mock('api', () => ({
  default: {
    settings: {
      value: vi.fn(),
      registerSection: vi.fn(),
      registerSettings: vi.fn(),
    },
    contentScripts: {
      register: vi.fn(),
      onMessage: vi.fn(),
    },
  },
}));

vi.mock('../src/settings', () => ({
  settings: { language: { value: 'en' } },
  pathSettings: ['biblePath', 'biblesPath'],
  registerSettings: vi.fn(),
}));

vi.mock('../src/utils/pluginRenderer', () => ({
  renderBibleBlock: vi.fn().mockReturnValue('<div>rendered</div>'),
}));

import joplin from 'api';
import { ContentScriptType } from 'api/types';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('init', () => {
  it('registers settings on start', async () => {
    vi.mocked(joplin.settings.value).mockResolvedValue('en');

    await init();

    const { registerSettings } = await import('../src/settings');
    expect(registerSettings).toHaveBeenCalled();
  });

  it('registers markdownItPlugin content script', async () => {
    vi.mocked(joplin.settings.value).mockResolvedValue('en');

    await init();

    expect(joplin.contentScripts.register).toHaveBeenCalledWith(
      ContentScriptType.MarkdownItPlugin,
      'bible-quote',
      './markdownItPlugin.js'
    );
  });

  it('sets up message handler', async () => {
    vi.mocked(joplin.settings.value).mockResolvedValue('en');

    await init();

    expect(joplin.contentScripts.onMessage).toHaveBeenCalledWith('bible-quote', expect.any(Function));
  });

  it('message handler returns null for non-render messages', async () => {
    vi.mocked(joplin.settings.value).mockResolvedValue('en');

    await init();

    const onMessageCall = vi.mocked(joplin.contentScripts.onMessage).mock.calls[0][1];
    const result = await onMessageCall({ name: 'someOtherAction' });
    expect(result).toBeNull();
  });

  it('message handler returns HTML for renderBible messages', async () => {
    vi.mocked(joplin.settings.value).mockImplementation(async (setting: string) => {
      const defaults: Record<string, unknown> = {
        language: 'en',
        biblePath: '/path/to/bible.xml',
        biblesPath: '/path/to/bibles',
        verseFontSize: 16,
        verseAlignment: 'justify',
        bookAlignment: 'center',
        chapterAlignment: 'left',
        chapterPadding: 10,
      };
      return defaults[setting];
    });

    await init();

    const onMessageCall = vi.mocked(joplin.contentScripts.onMessage).mock.calls[0][1];
    const result = await onMessageCall({ name: 'renderBible', source: '(Genesis 1:1)' });
    expect(result).toBe('<div>rendered</div>');
  });
});
