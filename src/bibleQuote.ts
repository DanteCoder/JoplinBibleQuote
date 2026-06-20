import joplin from 'api';
import { ContentScriptType } from 'api/types';
import * as path from 'path';
import { pathSettings, registerSettings, settings } from './settings';

export async function init() {
  console.log('Biblie Quote plugin started!');

  await registerSettings();

  localStorage.setItem('bibleQuotePlugin', JSON.stringify({}));

  for (const setting in settings) {
    await updateSetting(setting);
  }

  joplin.settings.onChange(async (event: { keys: string[] }) => {
    await settingsChanged(event);
  });

  await joplin.contentScripts.register(ContentScriptType.MarkdownItPlugin, 'bible-quote', './markdownItPlugin.js');
}

export async function settingsChanged(event: { keys: string[] }) {
  for (const key of event.keys) {
    await updateSetting(key);
  }
}

export async function updateSetting(setting: string): Promise<void> {
  localStorage.setItem('bibleQuoteSettingsUpdated', 'true');

  const localStorageConfig = JSON.parse(localStorage.getItem('bibleQuotePlugin') ?? '{}');

  let value = await joplin.settings.value(setting);

  if (pathSettings.includes(setting)) {
    if (typeof value === 'undefined') value = '';

    value = path.normalize(value);
  }

  localStorageConfig[setting] = value;
  localStorage.setItem('bibleQuotePlugin', JSON.stringify(localStorageConfig));
}
