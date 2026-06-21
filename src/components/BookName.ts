import { StyleProps } from '../interfaces/style';
import { createHtml } from '../utils/createHtml';

export default function BookName(props: Props) {
  const { name, style } = props;

  return createHtml('h2', `<b>${name}</b>`, { className: 'bq-book-name', style });
}

interface Props {
  name: string;
  style: StyleProps;
}
