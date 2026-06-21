interface Token {
  content: string;
  info: string;
}

interface Renderer {
  renderToken(tokens: Token[], idx: number, options: unknown, env: unknown, self: Renderer): string;
}

interface MarkdownIt {
  renderer: {
    rules: Partial<{
      fence: (tokens: Token[], idx: number, options: unknown, env: unknown, self: Renderer) => string;
    }>;
  };
  utils: {
    escapeHtml: (text: string) => string;
  };
}

export default function (context: { contentScriptId: string }) {
  const contentScriptId = context.contentScriptId;

  return {
    plugin: function (markdownIt: MarkdownIt, _options: unknown) {
      const defaultRender =
        markdownIt.renderer.rules.fence ||
        function (tokens: Token[], idx: number, _options: unknown, _env: unknown, self: Renderer) {
          return self.renderToken(tokens, idx, _options, _env, self);
        };

      markdownIt.renderer.rules.fence = function (
        tokens: Token[],
        idx: number,
        options: unknown,
        env: unknown,
        self: Renderer
      ) {
        const token = tokens[idx];

        if (token.info !== 'bible') return defaultRender(tokens, idx, options, env, self);

        const escapedSource = markdownIt.utils.escapeHtml(JSON.stringify(token.content));
        const escapedId = markdownIt.utils.escapeHtml(contentScriptId);

        return (
          '<div class="bible-quote-placeholder" data-source="' +
          escapedSource +
          '" data-cs-id="' +
          escapedId +
          '">[Bible Quote...]</div>'
        );
      };
    },
    assets: function () {
      return [{ name: 'bibleQuoteRuntime.js' }];
    },
  };
}
