import { cssObj2String } from '../utils/cssObj2String';

/**
 * Creates the html for a book
 * @param props
 * @returns html string
 */
export default function Book(props: Props) {
  const { chapters, name, displayName, style } = props;
  const html = document.createElement('div');

  if (displayName) {
    const bookNameTitle = document.createElement('h2');
    bookNameTitle.setAttribute('style', cssObj2String(style));
    bookNameTitle.innerHTML = `<b>${name}<b>`;
    html.appendChild(bookNameTitle);
  }

  for (const chapter of chapters) {
    html.innerHTML += chapter;
  }

  return html.outerHTML;
}

interface Props {
  chapters: Array<string>;
  name: string;
  displayName: boolean;
  style: any;
}
