import { cssObj2String } from '../utils/cssObj2String';

/**
 * Creates the html for errors
 * @param error
 * @returns html string
 */
export default function ErrorManager(errorMessage: string) {
  const html = document.createElement('div');
  html.setAttribute(
    'style',
    cssObj2String({
      padding: '30px',
      border: '1px solid red',
      textAlign: 'left',
    })
  );

  html.innerHTML = errorMessage.replace(/\n/g, '<br>');
  return html.outerHTML;
}
