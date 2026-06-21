import BibleIndex from '../components/BibleIndex';
import ErrorManager from '../components/ErrorManager';
import Help from '../components/Help';
import Main from '../components/Main';
import { BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { bibleIndexFull } from '../languages';
import parser, { BcvParser } from '../parser';
import { getOsisBible } from '../utils/getOsisBible';
import { getOsisBibles } from '../utils/getOsisBibles';

function importBcvParser(citationLanguage: string): BcvParser {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bcvModule: { bcv_parser: new () => BcvParser } = require(
    `bible-passage-reference-parser/js/${citationLanguage}_bcv_parser`
  );
  const bcv = new bcvModule.bcv_parser();

  return bcv;
}

export function renderBibleBlock(source: string, config: PluginConfig): string {
  const bibleIndex: BibleLanguage = bibleIndexFull[config.language];
  const osisBibleResult = getOsisBible(config.biblePath);

  if (osisBibleResult.errorMessage) {
    return ErrorManager(osisBibleResult.errorMessage);
  }

  const defaultOsisBible: OsisBible = osisBibleResult.osisBible!;
  const osisBibles = getOsisBibles(config.biblesPath);
  const availableVersions = osisBibles.map(bible => bible.$.osisIDWork);
  const bcv = importBcvParser(config.language);
  const bibleInfo = bcv.translation_info();

  const parseResult = parser(source, bcv, availableVersions);

  if (parseResult.type === 'error') return ErrorManager(parseResult.errorMessage!);

  if (parseResult.type === 'help') return Help({ language: config.language });

  if (parseResult.type === 'index')
    return BibleIndex({ bibleIndex, bibleInfo, bookId: parseResult.bookId ?? undefined });

  const html = Main({
    bibleIndex,
    bibleInfo,
    defaultOsisBible,
    osisBibles,
    parsedEntities: parseResult.entities!,
    pluginConfig: config,
  });

  return html;
}
