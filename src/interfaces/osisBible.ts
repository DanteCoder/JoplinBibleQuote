export interface OsisBible {
  $: {
    osisIDWork: string;
  };
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
