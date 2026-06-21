import { StyleProps } from '../interfaces/style';
import { createHtml } from '../utils/createHtml';
import BookName from './BookName';

export default function Book(props: Props) {
  const { chapters, name, displayName, style } = props;
  let content = '';

  if (displayName) {
    content += BookName({ name, style });
  }

  content += chapters.join('');

  return createHtml('div', content, { style });
}

interface Props {
  chapters: Array<string>;
  name: string;
  displayName: boolean;
  style: StyleProps;
}
