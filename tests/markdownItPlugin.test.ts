import { describe, it, expect } from 'vitest';
import markdownItPlugin from '../src/markdownItPlugin';

describe('markdownItPlugin', () => {
  const context = { contentScriptId: 'bible-quote' };
  const plugin = markdownItPlugin(context);

  it('returns an object with plugin and assets functions', () => {
    expect(typeof plugin.plugin).toBe('function');
    expect(typeof plugin.assets).toBe('function');
  });

  describe('assets', () => {
    it('returns the runtime script asset', () => {
      const assets = plugin.assets();
      expect(assets).toEqual([{ name: 'bibleQuoteRuntime.js' }]);
    });
  });

  describe('plugin', () => {
    it('replaces bible fence tokens with placeholder divs', () => {
      const tokens = [
        { content: 'Genesis 1:1', info: 'bible' },
      ];
      let capturedHtml = '';

      const markdownIt = {
        renderer: {
          rules: {
            fence: (_tokens: unknown[], _idx: unknown, _options: unknown, _env: unknown, _self: unknown) => '',
          },
        },
        utils: {
          escapeHtml: (text: string) => text,
        },
      } as unknown as { renderer: { rules: { fence: (tokens: unknown[], idx: unknown, options: unknown, env: unknown, self: unknown) => string } }; utils: { escapeHtml: (text: string) => string } };

      plugin.plugin(markdownIt, {});

      capturedHtml = markdownIt.renderer.rules.fence!(tokens, 0, {}, {}, null as unknown as never);

      expect(capturedHtml).toContain('bible-quote-placeholder');
      expect(capturedHtml).toContain('data-source=');
      expect(capturedHtml).toContain('data-cs-id=');
      expect(capturedHtml).toContain('[Bible Quote...]');
    });

    it('passes non-bible fence tokens to default renderer', () => {
      const tokens = [
        { content: 'some code', info: 'javascript' },
      ];

      const defaultRender = (_tokens: unknown[], _idx: unknown, _options: unknown, _env: unknown, _self: unknown) => '<pre>default</pre>';

      const markdownIt = {
        renderer: {
          rules: {} as { fence: (tokens: unknown[], idx: unknown, options: unknown, env: unknown, self: unknown) => string },
        },
        utils: {
          escapeHtml: (text: string) => text,
        },
      };

      const markdownItPluginFunc = markdownItPlugin(context);
      markdownItPluginFunc.plugin(markdownIt, {});
      markdownIt.renderer.rules.fence = defaultRender;

      const result = markdownIt.renderer.rules.fence(tokens, 0, {}, {}, null as unknown as never);
      expect(result).toBe('<pre>default</pre>');
    });
  });
});
