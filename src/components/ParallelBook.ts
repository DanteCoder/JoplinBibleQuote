import { cssObj2String } from '../utils/cssObj2String';

/**
 * Creates the html for parallel book titles
 * @param props
 * @returns html string
 */
export default function ParallelBook(props: Props) {
  const { displayName, name, style, versions } = props;
  const html = document.createElement('div');

  if (displayName) {
    const bookTitlesDiv = document.createElement('div');
    bookTitlesDiv.setAttribute(
      'style',
      cssObj2String({
        display: 'grid',
        gridTemplateColumns: '1fr '.repeat(versions),
      })
    );

    const bookNameTitle = document.createElement('h2');
    bookNameTitle.setAttribute('style', cssObj2String(style));
    bookNameTitle.innerHTML = `<b>${name}<b>`;
    bookTitlesDiv.innerHTML = bookNameTitle.outerHTML.repeat(versions);
    html.appendChild(bookTitlesDiv);
  }

  return html.outerHTML;
}

interface Props {
  displayName: boolean;
  name: string;
  style: any;
  versions: number;
}
