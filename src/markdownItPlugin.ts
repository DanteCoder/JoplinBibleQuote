import { BibleLanguage } from './interfaces/bibleIndex';
import { getOsisBible } from './utils/getOsisBible';
import { getPluginConfig } from './utils/getPluginConfig';
import bibleIndexFull from './bibleIndex';
import ErrorManager from './components/ErrorManager';
import Main from './components/Main';

let pluginConfig = getPluginConfig();
let bibleIndex: BibleLanguage = bibleIndexFull[pluginConfig.bookNamesLang];
let importResult = getOsisBible(pluginConfig.biblePath);
let osisBible = importResult.osisBible;
let bcv = importBcvParser(pluginConfig.citeLang);
const bibleInfo = bcv.translation_info();

export default function (context) {
  return {
    plugin: function (markdownIt, _options) {
      const defaultRender =
        markdownIt.renderer.rules.fence ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options, env, self);
        };

      markdownIt.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const token = tokens[idx];

        // The token after the "```"
        if (token.info !== 'bible') return defaultRender(tokens, idx, options, env, self);

        // Update the runtime variables with the new plugin config
        if (localStorage.getItem('bibleQuoteSettingsUpdated') === 'true') {
          localStorage.setItem('bibleQuoteSettingsUpdated', 'false');
          pluginConfig = getPluginConfig();
          bibleIndex = bibleIndexFull[pluginConfig.bookNamesLang];
          importResult = getOsisBible(pluginConfig.biblePath);
          osisBible = importResult.osisBible;
          bcv = importBcvParser(pluginConfig.citeLang);
        }

        // Invalid osis Bible import handle
        if (importResult.error) return ErrorManager(importResult.error);

        // Extract the citations from the block of text
        const citations = token.content.replace(/\n/g, ' ').match(/\(.*?\)/g);

        // Create the html to render
        const html = Main({
          bcv,
          bibleIndex,
          bibleInfo,
          citations,
          osisBible,
          pluginConfig,
        });

        return html;
      };
    },
  };
}

/**
 * Imports the corresponding bcv parser to match the configured language.
 * @param citationLanguage
 * @returns bcv parser.
 */
function importBcvParser(citationLanguage: string): any {
  const bcvParser: any = require(`bible-passage-reference-parser/js/${citationLanguage}_bcv_parser`).bcv_parser;
  const bcv = new bcvParser();
  return bcv;
}
