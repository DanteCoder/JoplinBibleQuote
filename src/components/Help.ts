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

const helpLanguages = {
  en:
    'Available commands:\n' +
    'command: help\n' +
    'action: Displays this help.\n\n' +
    'command: index\n' +
    'action: Displays the index of the Bible.\n\n' +
    'command: index OSIS-ID\n' +
    'action: Displays the chapters and their number of verses from a book ' +
    'by its OSIS ID. You can see the OSIS IDs with the "index" command.\n' +
    'e.g.\n' +
    'index Gen\n\n' +
    'command: (your citation)\n' +
    'action: Displays the citation between the parenthesis' +
    ' in the specified version, or the default version if ' +
    "there's no specified version.\n" +
    'e.g.\n' +
    '(Genesis 1:1)\n\n' +
    'command: version "VER"\n' +
    'action: Changes the version for the following citations\n' +
    'e.g.\n' +
    'version "KJV"\n' +
    '(Genesis 1:1)\n\n' +
    'command: versions "VER-1", "VER-2", "VER-N"\n' +
    'action: Displays the following citations on multiple versions.\n' +
    'e.g.\n' +
    'versions "KJV", "RVR"\n' +
    '(Genesis 1:1)\n' +
    '(John 3:16)\n\n' +
    'command: versions "VER-1", "VER-2", "VER-N" par\n' +
    'action: Displays the following citations on multiple versions ' +
    'in parallel columns.\n' +
    'e.g.\n' +
    'versions "KJV", "RVR" par\n' +
    '(Genesis 1:1)\n' +
    '(John 3:16)',
};

interface Props {
  language: string;
}
