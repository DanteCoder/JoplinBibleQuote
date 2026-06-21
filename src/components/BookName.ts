import { createHtml } from '../utils/createHtml';

export default function BookName(props: Props) {
  const { name } = props;

  return createHtml('h2', `<b>${name}</b>`, { className: 'bq-book-name' });
}

interface Props {
  name: string;
}
