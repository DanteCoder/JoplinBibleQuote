import { createHtml } from '../utils/createHtml';

export default function FullCitation(props: Props) {
  const { citation, displayOsisIDWork, osisIDWork } = props;
  const parts: string[] = [];

  if (citation) parts.push(`<b>${citation}</b>`);
  if (displayOsisIDWork) parts.push(`<b>(${osisIDWork})</b>`);

  const content = parts.join(' ');

  return createHtml('h3', content, { className: 'bq-citation' });
}

interface Props {
  citation: string;
  osisIDWork: string;
  displayOsisIDWork: boolean;
}
