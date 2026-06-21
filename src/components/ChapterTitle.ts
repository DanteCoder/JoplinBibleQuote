import { createHtml } from '../utils/createHtml';

export default function ChapterTitle(props: Props) {
  const { number, text, className } = props;

  return createHtml('h3', `${text} ${number}`, { className: className || 'bq-chapter-title' });
}

interface Props {
  number: number;
  text: string;
  className?: string;
}
