import { BibleInfo, BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedEntity } from '../interfaces/parseResult';
import { cssObj2String } from '../utils/cssObj2String';
import CitationsBlock from './CitationsBlock';
import ParallelBlock from './ParallelBlock';

export default function Main(props: Props) {
  const { bibleIndex, bibleInfo, parsedEntities, defaultOsisBible, osisBibles, pluginConfig } = props;
  const html = document.createElement('div');
  html.setAttribute('style', 'border:1px solid #545454;');

  for (const entity of parsedEntities) {
    if (entity.options?.parallel) {
      html.innerHTML += ParallelBlock({ bibleIndex, bibleInfo, osisBibles, parsedEntity: entity, pluginConfig });
    } else {
      html.innerHTML += CitationsBlock({ bibleIndex, bibleInfo, defaultOsisBible, entity, osisBibles, pluginConfig });
    }

    if (entity === parsedEntities[parsedEntities.length - 1]) continue;

    html.innerHTML += doubleHr();
  }

  return html.outerHTML;
}

function doubleHr(): string {
  const style = cssObj2String({
    border: 'none',
    borderTop: '3px double grey',
    marginBottom: '0px',
    marginLeft: '15px',
    marginRight: '15px',
    marginTop: '0px',
  });

  return `<hr style="${style}">`.repeat(2);
}

interface Props {
  bibleIndex: BibleLanguage;
  bibleInfo: BibleInfo;
  defaultOsisBible: OsisBible;
  osisBibles: Array<OsisBible>;
  parsedEntities: Array<ParsedEntity>;
  pluginConfig: PluginConfig;
}
