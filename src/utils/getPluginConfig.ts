import { PluginConfig } from '../interfaces/config';

/**
 * Gets the plugin configuration from localStorage
 * @returns pluginConfig object
 */
export function getPluginConfig() {
  const localStorageConfig: PluginConfig = JSON.parse(localStorage.getItem('bibleQuotePlugin'));
  return localStorageConfig;
}
