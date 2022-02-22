import { BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedQuote } from '../interfaces/parsedQuote';
import { ParsedEntity } from '../interfaces/parseResult';
import { cssObj2String } from '../utils/cssObj2String';
import { parseQuote } from '../utils/parseQuote';
import CitationsBlock from './CitationsBlock';

/**
 * Creates the html for the render
 * @param props
 * @returns html string
 */
export default function Main(props: Props) {
  const { bibleIndex, bibleInfo, parsedEntities, defaultOsisBible, osisBibles, pluginConfig } = props;
  const html = document.createElement('div');
  html.setAttribute('style', `border:1px solid #545454;`);

  for (const entity of parsedEntities) {
    const parsedQuotes: Array<ParsedQuote> = [];
    for (const osisObject of entity.osisObjects) {
      parsedQuotes.push(parseQuote(osisObject, bibleIndex, bibleInfo));
    }

    for (const version of entity.versions) {
      let osisBible: OsisBible;
      if (version === 'default') {
        osisBible = defaultOsisBible;
      } else {
        osisBible = osisBibles.find((bible) => bible.$.osisIDWork === version);
      }

      html.innerHTML += CitationsBlock({
        osisBible,
        parsedQuotes,
        pluginConfig,
      });

      if (version === entity.versions[entity.versions.length - 1]) continue;
      html.innerHTML += `<hr style="${cssObj2String({
        border: 'none',
        borderTop: '3px double grey',
        marginLeft: '30px',
        marginRight: '30px',
      })}">`;
    }
    if (entity === parsedEntities[parsedEntities.length - 1]) continue;
    html.innerHTML += `<hr style="${cssObj2String({
      border: 'none',
      borderTop: '3px double grey',
      marginBottom: '0px',
      marginLeft: '15px',
      marginRight: '15px',
      marginTop: '0px',
    })}">`.repeat(2);
  }

  return html.outerHTML;
}

interface Props {
  bibleIndex: BibleLanguage;
  bibleInfo: any;
  defaultOsisBible: OsisBible;
  osisBibles: Array<OsisBible>;
  parsedEntities: Array<ParsedEntity>;
  pluginConfig: PluginConfig;
}
