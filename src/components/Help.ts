import { helpLanguages } from '../languages';
import { createHtml } from '../utils/createHtml';

export default function Help(props: Props) {
  const { language } = props;
  const content = (helpLanguages[language] ?? helpLanguages.en).replace(/\n/g, '<br>');

  return createHtml('div', content, { className: 'bq-block bq-help' });
}

interface Props {
  language: string;
}
