import { describe, it, expect, vi, beforeEach } from 'vitest';
import { settings, pathSettings, registerSettings } from '../src/settings';
import { SettingItemType } from 'api/types';

vi.mock('api', () => ({
  default: {
    settings: {
      registerSection: vi.fn(),
      registerSettings: vi.fn(),
    },
  },
}));

import joplin from 'api';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('settings', () => {
  it('has expected number of settings', () => {
    expect(Object.keys(settings)).toHaveLength(8);
  });

  it('language setting defaults to English', () => {
    expect(settings.language.value).toBe('en');
    expect(settings.language.type).toBe(SettingItemType.String);
    expect(settings.language.isEnum).toBe(true);
    expect(settings.language.section).toBe('bibleQuoteSection');
  });

  it('verseFontSize has min/max constraints', () => {
    expect(settings.verseFontSize.minimum).toBe(10);
    expect(settings.verseFontSize.maximum).toBe(30);
    expect(settings.verseFontSize.type).toBe(SettingItemType.Int);
  });

  it('verseAlignment has enum options', () => {
    expect(settings.verseAlignment.options).toEqual({
      center: 'Center',
      left: 'Left',
      right: 'Right',
      justify: 'Justify',
    });
  });

  it('pathSettings contains biblePath and biblesPath', () => {
    expect(pathSettings).toContain('biblePath');
    expect(pathSettings).toContain('biblesPath');
  });
});

describe('registerSettings', () => {
  it('registers section and settings with Joplin API', async () => {
    await registerSettings();

    expect(joplin.settings.registerSection).toHaveBeenCalledWith('bibleQuoteSection', {
      iconName: 'fas fa-book',
      label: 'Bible Quote',
    });

    expect(joplin.settings.registerSettings).toHaveBeenCalledWith(settings);
  });
});
