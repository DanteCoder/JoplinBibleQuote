import joplin from 'api';
import { SettingItem, SettingItemType } from 'api/types';

export namespace Settings {
  export const settings: Record<string, SettingItem> = {
    language: {
      value: 'en',
      type: SettingItemType.String,
      isEnum: true,
      section: 'bibleQuoteSection',
      public: true,
      label: 'Language',
      description: 'The language to display for book names and to parse citations.',
      options: {
        en: 'English',
        es: 'Spanish',
        fr: 'Français',
      },
    },
    biblePath: {
      value: '',
      type: SettingItemType.String,
      section: 'bibleQuoteSection',
      public: true,
      label: 'Path to the default OSIS Bible file',
      description: 'e.g. C:/My/Path/To/Default-OSIS-Bible.xml',
    },
    biblesPath: {
      value: '',
      type: SettingItemType.String,
      section: 'bibleQuoteSection',
      public: true,
      label: 'Path to a folder containing OSIS bibles',
      description: 'If you want to select from multiple versions: e.g. C:/My/Path/To/MyFolder',
    },
    bookAlignment: {
      value: 'center',
      type: SettingItemType.String,
      isEnum: true,
      section: 'bibleQuoteSection',
      public: true,
      label: 'Bible book name alignment',
      options: {
        center: 'Center',
        left: 'Left',
        right: 'Right',
        justify: 'Justify',
      },
    },
    chapterAlignment: {
      value: 'left',
      type: SettingItemType.String,
      isEnum: true,
      section: 'bibleQuoteSection',
      public: true,
      label: 'Chapter number alignment',
      options: {
        center: 'Center',
        left: 'Left',
        right: 'Right',
        justify: 'Justify',
      },
    },
    chapterPadding: {
      value: 10,
      minimum: 0,
      maximum: 100,
      type: SettingItemType.Int,
      section: 'bibleQuoteSection',
      public: true,
      label: 'Chapter side padding',
      description: 'Chapter side padding in pixels.',
    },
    verseFontSize: {
      value: 16,
      minimum: 10,
      maximum: 30,
      type: SettingItemType.Int,
      section: 'bibleQuoteSection',
      public: true,
      label: 'Verse font size',
    },
    verseAlignment: {
      value: 'justify',
      type: SettingItemType.String,
      isEnum: true,
      section: 'bibleQuoteSection',
      public: true,
      label: 'Verse alignment',
      options: {
        center: 'Center',
        left: 'Left',
        right: 'Right',
        justify: 'Justify',
      },
    },
    displayFormat: {
      value: 'full',
      type: SettingItemType.String,
      isEnum: true,
      section: 'bibleQuoteSection',
      public: true,
      label: 'Display citation on the view',
      description: `Displays the full citation on top of the view.`,
      options: {
        cite: 'Display',
        full: 'Hide',
      },
    },
    displayBibleVersion: {
      value: true,
      type: SettingItemType.Bool,
      isEnum: true,
      section: 'bibleQuoteSection',
      public: true,
      label: 'Display Bible version on citation',
      description: `Displays or hides the Bible version. Only works when the "Display citation" is enabled.`,
      options: {
        true: 'Display',
        false: 'Hide',
      },
    },
  };

  export const pathSettings = ['biblePath', 'biblesPath'];

  export async function register() {
    await joplin.settings.registerSection('bibleQuoteSection', {
      iconName: 'fas fa-book',
      label: 'Bible Quote',
    });

    await joplin.settings.registerSettings(settings);
  }
}
