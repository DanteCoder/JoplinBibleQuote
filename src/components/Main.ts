import { BibleInfo, BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedEntity } from '../interfaces/parseResult';
import { createHtml } from '../utils/createHtml';
import CitationsBlock from './CitationsBlock';
import ParallelBlock from './ParallelBlock';

export default function Main(props: Props) {
  const { bibleIndex, bibleInfo, parsedEntities, defaultOsisBible, osisBibles, pluginConfig } = props;
  let content = '';

  for (const entity of parsedEntities) {
    if (entity.options?.parallel) {
      content += ParallelBlock({ bibleIndex, bibleInfo, osisBibles, parsedEntity: entity, pluginConfig });
    } else {
      content += CitationsBlock({ bibleIndex, bibleInfo, defaultOsisBible, entity, osisBibles, pluginConfig });
    }

    if (entity === parsedEntities[parsedEntities.length - 1]) continue;

    content += doubleHr();
  }

  const styleVars = {
    '--bq-vf': `${pluginConfig.verseFontSize}px`,
    '--bq-va': pluginConfig.verseAlignment,
    '--bq-ba': pluginConfig.bookAlignment,
    '--bq-ca': pluginConfig.chapterAlignment,
    '--bq-cp': `${pluginConfig.chapterPadding}px`,
  };

  return createHtml('div', content, { className: 'bq-main', style: styleVars });
}

function doubleHr(): string {
  return '<hr class="bq-double-hr">'.repeat(2);
}

interface Props {
  bibleIndex: BibleLanguage;
  bibleInfo: BibleInfo;
  defaultOsisBible: OsisBible;
  osisBibles: Array<OsisBible>;
  parsedEntities: Array<ParsedEntity>;
  pluginConfig: PluginConfig;
}
