import { PluginConfig } from '../interfaces/config';

export function getPluginConfig(): PluginConfig {
  const localStorageConfig: PluginConfig = JSON.parse(localStorage.getItem('bibleQuotePlugin') ?? '{}');

  return localStorageConfig;
}
