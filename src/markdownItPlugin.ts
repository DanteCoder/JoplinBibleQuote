import BibleIndex from './components/BibleIndex';
import ErrorManager from './components/ErrorManager';
import Help from './components/Help';
import Main from './components/Main';
import { BibleLanguage } from './interfaces/bibleIndex';
import { bibleIndexFull } from './languages';
import parser, { BcvParser } from './parser';
import { getOsisBible } from './utils/getOsisBible';
import { getOsisBibles } from './utils/getOsisBibles';
import { getPluginConfig } from './utils/getPluginConfig';

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
}

let pluginConfig = getPluginConfig();
let bibleIndex: BibleLanguage = bibleIndexFull[pluginConfig.language];
let osisBibleResult = getOsisBible(pluginConfig.biblePath);
let defaultOsisBible = osisBibleResult.osisBible;
let osisBibles = getOsisBibles(pluginConfig.biblesPath);
let availableVersions = osisBibles.map(bible => bible.$.osisIDWork);
let bcv = importBcvParser(pluginConfig.language);
const bibleInfo = bcv.translation_info();

export default function (_context: { contentScriptId: string }) {
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

        if (localStorage.getItem('bibleQuoteSettingsUpdated') === 'true') {
          localStorage.setItem('bibleQuoteSettingsUpdated', 'false');
          pluginConfig = getPluginConfig();
          bibleIndex = bibleIndexFull[pluginConfig.language];
          osisBibleResult = getOsisBible(pluginConfig.biblePath);
          defaultOsisBible = osisBibleResult.osisBible;
          osisBibles = getOsisBibles(pluginConfig.biblesPath);
          availableVersions = osisBibles.map(bible => bible.$.osisIDWork);
          bcv = importBcvParser(pluginConfig.language);
        }

        if (osisBibleResult.errorMessage) return ErrorManager(osisBibleResult.errorMessage);

        const parseResult = parser(token.content, bcv, availableVersions);

        if (parseResult.type === 'error') return ErrorManager(parseResult.errorMessage!);

        if (parseResult.type === 'help') return Help({ language: pluginConfig.language });

        if (parseResult.type === 'index')
          return BibleIndex({ bibleIndex, bibleInfo, bookId: parseResult.bookId ?? undefined });

        const html = Main({
          bibleIndex,
          bibleInfo,
          defaultOsisBible: defaultOsisBible!,
          osisBibles,
          parsedEntities: parseResult.entities!,
          pluginConfig,
        });

        return html;
      };
    },
  };
}

// BcvParser is imported from parser.ts

function importBcvParser(citationLanguage: string): BcvParser {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bcvModule: { bcv_parser: new () => BcvParser } = require(
    `bible-passage-reference-parser/js/${citationLanguage}_bcv_parser`
  );
  const bcv = new bcvModule.bcv_parser();

  return bcv;
}
