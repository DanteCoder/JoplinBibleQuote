import { cssObj2String } from '../utils/cssObj2String';

/**
 * Creates the html for a chapter
 * @param props
 * @returns html string
 */
export default function Chapter(props: Props) {
  const { verses, text, number, displayChapter, style } = props;
  const html = document.createElement('div');

  if (displayChapter) {
    const chapterTitle = document.createElement('h3');
    chapterTitle.setAttribute('style', cssObj2String(style));
    chapterTitle.innerHTML = `${text} ${number}`;
    html.appendChild(chapterTitle);
  }

  const versesDiv = document.createElement('div');
  versesDiv.setAttribute('style', `display: flex; flex-direction: column; gap: 8px;`);

  for (const verse of verses) {
    versesDiv.innerHTML += verse;
  }
  html.appendChild(versesDiv);

  return html.outerHTML;
}

interface Props {
  verses: Array<string>;
  number: number;
  text: string;
  displayChapter: boolean;
  style: any;
}
