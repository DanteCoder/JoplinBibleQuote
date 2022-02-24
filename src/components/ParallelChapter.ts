import { cssObj2String } from '../utils/cssObj2String';

/**
 * Creates the html for parallel chapters
 * @param props
 * @returns html string
 */
export default function ParallelChapter(props: Props) {
  const { displayChapter, number, parallelVerses, style, text, versions } = props;
  const html = document.createElement('div');

  if (displayChapter) {
    const chapterTitlesDiv = document.createElement('div');
    chapterTitlesDiv.setAttribute(
      'style',
      cssObj2String({
        display: 'grid',
        gridTemplateColumns: '1fr '.repeat(versions),
      })
    );

    const chapterTitle = document.createElement('h3');
    chapterTitle.setAttribute('style', cssObj2String(style));
    chapterTitle.innerHTML = `${text} ${number}`;
    chapterTitlesDiv.innerHTML = chapterTitle.outerHTML.repeat(versions);
    html.appendChild(chapterTitlesDiv);
  }

  html.innerHTML += parallelVerses;
  return html.outerHTML;
}

interface Props {
  displayChapter: boolean;
  number: number;
  parallelVerses: string;
  style: any;
  text: string;
  versions: number;
}
