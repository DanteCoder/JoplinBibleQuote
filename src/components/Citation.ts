import FullCitation from './FullCitation';

/**
 * Creates the html for a citation
 * @param props
 * @returns html string
 */
export default function Citation(props: Props) {
  const { books, citation, osisIDWork, displayFullCitation, displayOsisIDWork, style } = props;
  const html = document.createElement('div');

  if (displayFullCitation) {
    html.innerHTML += FullCitation({ citation, displayOsisIDWork, osisIDWork, style });
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
