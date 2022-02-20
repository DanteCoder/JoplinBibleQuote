export interface OsisBible {
  div: Array<book>;
}

interface book {
  chapter: Array<chapter>;
}

interface chapter {
  verse: Array<verse>;
}

interface verse {
  _: string;
}
