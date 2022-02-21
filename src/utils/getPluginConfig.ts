import path = require('path');
import { PluginConfig } from '../interfaces/config';
import bibleIndexFull from '../bibleIndex';

/**
 * Gets the plugin configuration from localStorage
 * @returns pluginConfig object
 */
export function getPluginConfig() {
  const localStorageConfig = JSON.parse(localStorage.getItem('bibleQuotePlugin'));
  const pluginConfig: PluginConfig = {
    citationLanguage: localStorageConfig['citeLang'],
    bookNamesLanguage: localStorageConfig['bookNamesLang'],
    biblePath: path.normalize(localStorageConfig['biblePath']),
    bookAlignment: localStorageConfig['bookAlignment'],
    chapterAlignment: localStorageConfig['chapterAlignment'],
    chapterPadding: localStorageConfig['chapterPadding'],
    verseFontSize: localStorageConfig['verseFontSize'],
    verseAlignment: localStorageConfig['verseAlignment'],
    displayFormat: localStorageConfig['displayFormat'],
    displayBibleVersion: localStorageConfig['displayBibleVersion'],
    chapterTitleText: '',
  };
  pluginConfig.chapterTitleText = bibleIndexFull[pluginConfig.bookNamesLanguage].chapterTitle;

  for (const key in pluginConfig) {
    if (pluginConfig[key] === '') pluginConfig[key] = null;
  }

  return pluginConfig;
}
