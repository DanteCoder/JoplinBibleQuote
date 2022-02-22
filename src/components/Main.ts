import { BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedEntity } from '../interfaces/parsedEntity';
import { ParsedQuote } from '../interfaces/parsedQuote';
import { cssObj2String } from '../utils/cssObj2String';
import { parseQuote } from '../utils/parseQuote';
import CitationsBlock from './CitationsBlock';

/**
 * Creates the html for the render
 * @param props
 * @returns html string
 */
export default function Main(props: Props) {
  const { bcv, bibleIndex, bibleInfo, parsedEntities, defaultOsisBible, osisBibles, pluginConfig } = props;
  const html = document.createElement('div');
  html.setAttribute('style', `border:1px solid #545454;`);

  if (parsedEntities[0][0].type === 'error') {
    html.innerHTML = parsedEntities[0][0].content;
    return html.outerHTML;
  }

  if (parsedEntities[0][0].type === 'help') {
    html.innerHTML = parsedEntities[0][0].content;
    return html.outerHTML;
  }

  for (const entityGroup of parsedEntities) {
    const versions = entityGroup[0].content.versions;

    const parsedQuotes: Array<ParsedQuote> = [];
    for (const entity of entityGroup) {
      parsedQuotes.push(parseQuote(entity.content.citation, bcv, bibleIndex, bibleInfo));
    }

    for (const version of versions) {
      const osisBible =
        version === 'default' ? defaultOsisBible : osisBibles.find((bible) => bible.$.osisIDWork === version);

      html.innerHTML += CitationsBlock({
        osisBible,
        parsedQuotes,
        pluginConfig,
      });

      if (version === versions[versions.length - 1]) continue;
      html.innerHTML += `<hr style="${cssObj2String({
        border: 'none',
        borderTop: '3px double grey',
        marginLeft: '30px',
        marginRight: '30px',
      })}">`;
    }
    if (entityGroup === parsedEntities[parsedEntities.length - 1]) continue;
    html.innerHTML += `<hr style="${cssObj2String({
      border: 'none',
      borderTop: '3px double grey',
      margin: '0px',
    })}">`;
  }

  return html.outerHTML;
}

interface Props {
  bcv: any;
  bibleIndex: BibleLanguage;
  bibleInfo: any;
  defaultOsisBible: OsisBible;
  osisBibles: Array<OsisBible>;
  parsedEntities: Array<Array<ParsedEntity>>;
  pluginConfig: PluginConfig;
}
