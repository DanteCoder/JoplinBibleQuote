import { createHtml } from '../utils/createHtml';
import BookName from './BookName';

export default function Book(props: Props) {
  const { chapters, name, displayName } = props;
  let content = '';

  if (displayName) {
    content += BookName({ name });
  }

  content += chapters.join('');

  return createHtml('div', content, { className: 'bq-book' });
}

interface Props {
  chapters: Array<string>;
  name: string;
  displayName: boolean;
}
