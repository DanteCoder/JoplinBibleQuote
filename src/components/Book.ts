import BookName from './BookTitle';

/**
 * Creates the html for a book
 * @param props
 * @returns html string
 */
export default function Book(props: Props) {
  const { chapters, name, displayName, style } = props;
  const html = document.createElement('div');

  if (displayName) {
    html.innerHTML += BookName({ name, style });
  }

  for (const chapter of chapters) {
    html.innerHTML += chapter;
  }

  return html.outerHTML;
}

interface Props {
  chapters: Array<string>;
  name: string;
  displayName: boolean;
  style: any;
}
