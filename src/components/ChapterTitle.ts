import { StyleProps } from '../interfaces/style';
import { createHtml } from '../utils/createHtml';

export default function ChapterTitle(props: Props) {
  const { number, style, text } = props;

  return createHtml('h3', `${text} ${number}`, { className: 'bq-chapter-title', style });
}

interface Props {
  number: number;
  style: StyleProps;
  text: string;
}
