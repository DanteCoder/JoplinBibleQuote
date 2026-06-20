export interface OsisBible {
  $: {
    osisIDWork: string;
  };
  div: Array<OsisBook>;
}

export interface OsisBook {
  $: {
    osisRefWork: string;
    osisIDWork: string;
    osisID: string;
  };
  chapter: Array<OsisChapter>;
}

export interface OsisChapter {
  $: {
    osisID: string;
  };
  verse: Array<OsisVerse>;
}

export interface OsisVerse {
  $: {
    osisID: string;
  };
  _: string;
}
