import path = require('path');
import joplin from 'api';
import { Settings } from './settings';
import { ContentScriptType } from 'api/types';

export namespace bibleQuote {
  export async function init() {
    console.log('Biblie Quote plugin started!');

    await Settings.register();

    // Save the plugins settings to localStorage to be available to the markdownItPlugin
    localStorage.setItem('bibleQuotePlugin', JSON.stringify({}));
    for (const setting in Settings.settings) {
      await updateSetting(setting);
    }

    // Save the changed settings to localStorage
    joplin.settings.onChange(async (event: any) => {
      await bibleQuote.settingsChanged(event);
    });

    await joplin.contentScripts.register(ContentScriptType.MarkdownItPlugin, 'bible-quote', './markdownItPlugin.js');
  }

  /**
   * Saves the changed settings to localStorage
   * @param event
   */
  export async function settingsChanged(event: any) {
    for (let key of event.keys) {
      await updateSetting(key);
    }
  }

  /**
   * Saves a setting to the localStorage
   * @param setting
   */
  export async function updateSetting(setting: string): Promise<void> {
    localStorage.setItem('bibleQuoteSettingsUpdated', 'true');
    const localStorageConfig = JSON.parse(localStorage.getItem('bibleQuotePlugin'));

    let value = await joplin.settings.value(setting);

    // If the setting is a path normalize it before saving to localStorage
    if (Settings.pathSettings.includes(setting)) {
      if (typeof value === 'undefined') value = '';
      value = path.normalize(value);
    }

    localStorageConfig[setting] = value;
    localStorage.setItem('bibleQuotePlugin', JSON.stringify(localStorageConfig));
  }
}
