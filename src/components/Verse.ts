import { createHtml } from '../utils/createHtml';

export default function Verse(props: Props) {
  const { text, number, displayNumber } = props;
  const content = `${displayNumber ? `${number}. ` : ''}${text}`;

  return createHtml('div', content, { className: 'bq-verse' });
}

interface Props {
  text: string;
  number: number;
  displayNumber: boolean;
}
