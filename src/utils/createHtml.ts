import { StyleProps } from '../interfaces/style';
import { cssObj2String } from './cssObj2String';

interface HtmlConfig {
  className?: string;
  style?: StyleProps;
}

export function createHtml(tag: string, content: string, config?: HtmlConfig): string {
  const classAttr = config?.className ? ` class="${config.className}"` : '';
  const styleAttr = config?.style ? ` style="${cssObj2String(config.style)}"` : '';

  return `<${tag}${classAttr}${styleAttr}>${content}</${tag}>`;
}
