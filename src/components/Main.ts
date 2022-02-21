import { BibleLanguage } from '../interfaces/bibleIndex';
import { PluginConfig } from '../interfaces/config';
import { OsisBible } from '../interfaces/osisBible';
import { ParsedQuote } from '../interfaces/parsedQuote';
import { parseQuote } from '../utils/parseQuote';
import CitationsBlock from './CitationsBlock';

/**
 * Creates the html for the render
 * @param props
 * @returns html string
 */
export default function Main(props: Props) {
  const { bcv, bibleIndex, bibleInfo, citations, osisBible, pluginConfig } = props;
  const html = document.createElement('div');
  html.setAttribute('style', `border:1px solid #545454;`);

  const parsedQuotes: Array<ParsedQuote> = [];
  for (const citation of citations) {
    parsedQuotes.push(parseQuote(citation, bcv, bibleIndex, bibleInfo));
  }

  html.innerHTML += CitationsBlock({
    osisBible,
    parsedQuotes,
    pluginConfig,
  });

  return html.outerHTML;
}

interface Props {
  citations: Array<string>;
  bcv: any;
  bibleIndex: BibleLanguage;
  bibleInfo: any;
  osisBible: OsisBible;
  pluginConfig: PluginConfig;
}
