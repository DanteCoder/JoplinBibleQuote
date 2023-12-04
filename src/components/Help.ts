import { helpLanguages } from '../languages';
import { cssObj2String } from '../utils/cssObj2String';

/**
 * Creates the html for help
 * @param error
 * @returns html string
 */
export default function Help(props: Props) {
  const { language } = props;
  const html = document.createElement('div');
  html.setAttribute(
    'style',
    cssObj2String({
      padding: '30px',
      border: '1px solid green',
      textAlign: 'left',
    })
  );

  html.innerHTML = (helpLanguages[language] ?? helpLanguages.en).replace(/\n/g, '<br>');
  return html.outerHTML;
}

interface Props {
  language: string;
}
