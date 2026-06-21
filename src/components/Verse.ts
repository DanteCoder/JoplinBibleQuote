import { StyleProps } from '../interfaces/style';
import { createHtml } from '../utils/createHtml';

export default function Verse(props: Props) {
  const { text, number, displayNumber, style } = props;
  const content = `${displayNumber ? `${number}. ` : ''}${text}`;

  return createHtml('div', content, { className: 'bq-verse', style });
}

interface Props {
  text: string;
  number: number;
  displayNumber: boolean;
  style: StyleProps;
}
