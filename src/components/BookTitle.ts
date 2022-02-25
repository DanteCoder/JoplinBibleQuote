import { cssObj2String } from '../utils/cssObj2String';

/**
 * Creates the html for a book title
 * @param props
 * @returns html string
 */
export default function BookName(props: Props) {
  const { name, style } = props;
  const html = document.createElement('h2');

  html.setAttribute('style', cssObj2String({ ...style, minWidth: 'max-content' }));
  html.innerHTML = `<b>${name}<b>`;

  return html.outerHTML;
}

interface Props {
  name: string;
  style: any;
}
