export interface OsisBible {
  $: {
    osisIDWork: string;
  };
  div: Array<book>;
}

interface book {
  $: {
    osisRefWork: string;
    osisIDWork: string;
    osisID: string;
  };
  chapter: Array<chapter>;
}

interface chapter {
  $: {
    osisID: string;
  };
  verse: Array<verse>;
}

interface verse {
  $: {
    osisID: string;
  };
  _: string;
}
