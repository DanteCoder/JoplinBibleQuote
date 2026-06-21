import { StyleProps } from '../interfaces/style';
import { createHtml } from '../utils/createHtml';
import FullCitation from './FullCitation';

export default function Citation(props: Props) {
  const { books, citation, osisIDWork, displayFullCitation, displayOsisIDWork, style } = props;
  let content = '';

  if (displayFullCitation) {
    content += FullCitation({ citation, displayOsisIDWork, osisIDWork, style });
  }

  content += books.join('');

  return createHtml('div', content, { style });
}

interface Props {
  books: Array<string>;
  citation: string;
  displayFullCitation: boolean;
  displayOsisIDWork: boolean;
  osisIDWork: string;
  style: StyleProps;
}
