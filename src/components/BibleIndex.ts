import { BibleInfo, BibleLanguage } from '../interfaces/bibleIndex';
import { createHtml } from '../utils/createHtml';

export default function BibleIndex(props: Props) {
  const { bibleIndex, bibleInfo, bookId } = props;
  const osisBooksIds: Array<string> = Object.keys(bibleInfo.order);
  const osisBooksOrder: Array<number> = Object.values(bibleInfo.order);
  let content = '';

  if (bookId) {
    content += `<p>${bibleIndex.books[bibleInfo.order[bookId] - 1]}</p><p></p>`;
    content += `<p>${bibleIndex.chapter}</p>`;
    content += `<p>${bibleIndex.verses}</p>`;

    bibleInfo.chapters[bookId].forEach((verses, i) => {
      content += `<p class="bq-index-p">${i + 1}</p>`;
      content += `<p class="bq-index-p">${verses}</p>`;
    });
  } else {
    content += `<p>${bibleIndex.book}</p>`;
    content += `<p>${bibleIndex.chapters}</p>`;
    content += '<p>OSIS ID</p>';

    bibleIndex.books.forEach((book, i) => {
      const osisId = osisBooksIds[osisBooksOrder[i] - 1];
      content += `<p class="bq-index-p">${i + 1}. ${book}</p>`;
      content += `<p class="bq-index-p">${bibleInfo.chapters[osisId].length}</p>`;
      content += `<p class="bq-index-p">${osisId}</p>`;

      if (i === 38) {
        content += '<p></p>'.repeat(3);
      }
    });
  }

  return createHtml('div', content, {
    className: 'bq-block bq-index',
    style: {
      display: 'grid',
      gridTemplateColumns: !bookId ? '1fr 0.6fr 0.4fr' : '1fr 1fr',
    },
  });
}

interface Props {
  bibleIndex: BibleLanguage;
  bibleInfo: BibleInfo;
  bookId?: string;
}
