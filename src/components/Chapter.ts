import { StyleProps } from '../interfaces/style';
import { createHtml } from '../utils/createHtml';
import ChapterTitle from './ChapterTitle';

export default function Chapter(props: Props) {
  const { verses, text, number, displayChapter, style } = props;
  let content = '';

  if (displayChapter) {
    content += ChapterTitle({ number, style, text });
  }

  content += createHtml('div', verses.join(''), { className: 'bq-verse-flex' });

  return createHtml('div', content, { style });
}

interface Props {
  verses: Array<string>;
  number: number;
  text: string;
  displayChapter: boolean;
  style: StyleProps;
}
