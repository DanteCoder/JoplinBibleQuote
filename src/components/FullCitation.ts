import { StyleProps } from '../interfaces/style';
import { createHtml } from '../utils/createHtml';

export default function FullCitation(props: Props) {
  const { citation, displayOsisIDWork, osisIDWork, style } = props;
  const content = displayOsisIDWork ? `<b>${citation}</b> <b>(${osisIDWork})</b>` : `<b>${citation}</b>`;

  return createHtml('h3', content, { className: 'bq-citation', style });
}

interface Props {
  style: StyleProps;
  citation: string;
  osisIDWork: string;
  displayOsisIDWork: boolean;
}
