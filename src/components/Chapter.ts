import { createHtml } from '../utils/createHtml';
import ChapterTitle from './ChapterTitle';

export default function Chapter(props: Props) {
  const { verses, text, number, displayChapter, indented } = props;
  let content = '';

  if (displayChapter) {
    const cls = indented ? 'bq-chapter-title bq-chapter-title--indented' : 'bq-chapter-title';
    content += ChapterTitle({ number, className: cls, text });
  }

  content += createHtml('div', verses.join(''), { className: 'bq-verse-flex' });

  return createHtml('div', content, { className: 'bq-chapter' });
}

interface Props {
  verses: Array<string>;
  number: number;
  text: string;
  displayChapter: boolean;
  indented?: boolean;
}
