import { cssObj2String } from '../utils/cssObj2String';

/**
 * Creates the html for help
 * @param error
 * @returns html string
 */
export default function Help() {
  const html = document.createElement('div');
  html.setAttribute(
    'style',
    cssObj2String({
      padding: '30px',
      border: '1px solid green',
      textAlign: 'left',
    })
  );

  html.innerHTML = (
    'Available commands:\n' +
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
    'version "KJV", "RVR"\n' +
    '(Genesis 1:1)\n' +
    '(John 3:16)'
  ).replace(/\n/g, '<br>');
  return html.outerHTML;
}
