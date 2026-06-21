import joplin from 'api';
import { ContentScriptType } from 'api/types';
import * as path from 'path';
import { PluginConfig } from './interfaces/config';
import { pathSettings, registerSettings } from './settings';
import { renderBibleBlock } from './utils/pluginRenderer';

interface RenderBibleMessage {
  name: 'renderBible';
  source: string;
}

function isRenderBibleMessage(message: unknown): message is RenderBibleMessage {
  if (typeof message !== 'object' || message === null) return false;
  if (!('name' in message) || !('source' in message)) return false;

  const nameValue = Object.getOwnPropertyDescriptor(message, 'name')?.value;
  const sourceValue = Object.getOwnPropertyDescriptor(message, 'source')?.value;

  return nameValue === 'renderBible' && typeof sourceValue === 'string';
}

async function readSetting(setting: string): Promise<string> {
  let value = await joplin.settings.value(setting);

  if (pathSettings.includes(setting)) {
    if (typeof value === 'undefined') value = '';

    value = path.normalize(value);
  }

  return value;
}

async function readConfig(): Promise<PluginConfig> {
  return {
    language: await readSetting('language'),
    biblePath: await readSetting('biblePath'),
    biblesPath: await readSetting('biblesPath'),
    verseFontSize: await joplin.settings.value('verseFontSize'),
    verseAlignment: await readSetting('verseAlignment'),
    bookAlignment: await readSetting('bookAlignment'),
    chapterAlignment: await readSetting('chapterAlignment'),
    chapterPadding: await joplin.settings.value('chapterPadding'),
  };
}

export async function init() {
  console.log('Bible Quote plugin started!');

  await registerSettings();

  await joplin.contentScripts.register(ContentScriptType.MarkdownItPlugin, 'bible-quote', './markdownItPlugin.js');

  await joplin.contentScripts.onMessage('bible-quote', async (message: unknown) => {
    if (!isRenderBibleMessage(message)) return null;

    const config = await readConfig();

    return renderBibleBlock(message.source, config);
  });
}
