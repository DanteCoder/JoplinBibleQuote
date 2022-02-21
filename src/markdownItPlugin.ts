import { BibleLanguage } from './interfaces/bibleIndex';
import { PluginConfig } from './interfaces/config';
import { getOsisBible } from './utils/getOsisBible';
import { getPluginConfig } from './utils/getPluginConfig';
import bibleIndexFull from './bibleIndex';
import Main from './components/Main';

let pluginConfig: PluginConfig = getPluginConfig();
let bibleIndex: BibleLanguage = bibleIndexFull[pluginConfig.bookNamesLanguage];
let importResult = getOsisBible(pluginConfig.biblePath);
let osisBible = importResult.osisBible;
let bcv = importBcvParser(pluginConfig.citationLanguage);
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
          bibleIndex = bibleIndexFull[pluginConfig.bookNamesLanguage];
          importResult = getOsisBible(pluginConfig.biblePath);
          osisBible = importResult.osisBible;
          bcv = importBcvParser(pluginConfig.citationLanguage);
        }

        // Invalid osis Bible import handle
        if (importResult.error) {
          return (
            '<div style="padding:35px; border: 1px solid #545454;">' +
            '<p style="text-align: center;">There is no selected OSIS xml bible or the path is invalid.<p>' +
            `<p style="text-align: center;">Error code: ${importResult.error}<p>` +
            '</div>'
          );
        }

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
