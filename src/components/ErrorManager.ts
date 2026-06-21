import { createHtml } from '../utils/createHtml';

export default function ErrorManager(errorMessage: string) {
  return createHtml('div', errorMessage.replace(/\n/g, '<br>'), { className: 'bq-block bq-error' });
}
