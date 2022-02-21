import { cssObj2String } from '../utils/cssObj2String';

/**
 * Creates the html for a citation
 * @param props
 * @returns html string
 */
export default function Citation(props: Props) {
  const { books, citation, osisIDWork, displayFullCitation, displayOsisIDWork, style } = props;
  const html = document.createElement('div');

  if (displayFullCitation) {
    const citationTitle = document.createElement('h3');
    citationTitle.setAttribute('style', cssObj2String(style));
    citationTitle.innerHTML = `<b>${citation}<b>`;

    if (displayOsisIDWork) citationTitle.innerHTML += `<b> (${osisIDWork})<b>`;

    html.appendChild(citationTitle);
  }

  for (const book of books) {
    html.innerHTML += book;
  }

  return html.outerHTML;
}

interface Props {
  books: Array<string>;
  citation: string;
  displayFullCitation: boolean;
  displayOsisIDWork: boolean;
  osisIDWork: string;
  style: any;
}
