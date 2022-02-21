import { cssObj2String } from '../utils/cssObj2String';

/**
 * Creates the html for the getOsisBible errors
 * @param error
 * @returns html string
 */
export default function ErrorManager(error: any) {
  const html = document.createElement('div');
  html.setAttribute(
    'style',
    cssObj2String({
      padding: '10px',
      border: '1px solid red',
      textAlign: 'center',
    })
  );

  switch (error.code) {
    case 'ENOENT':
      html.innerHTML = 'Invalid path for the OSIS Bible.';
      break;

    case 'EISDIR':
      html.innerHTML = 'There is no selected path for the OSIS Bible.';
      break;

    default:
      html.innerHTML = 'Error importing the OSIS Bible.<br>Check if the file is on OSIS format.';
      break;
  }

  return html.outerHTML;
}
