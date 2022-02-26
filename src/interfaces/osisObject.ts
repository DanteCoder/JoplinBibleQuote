export interface OsisObject {
  osis: string;
  indices: Array<number>;
  translations: Array<string>;
  entity_id: number;
  entities: Array<OsisEntity>;
}

export interface OsisEntity {
  osis: string;
  type: 'bcv' | 'bc' | 'cv' | 'integer' | 'range';
  indices: Array<number>;
  translations: Array<string>;
  start: BCV | any;
  end: BCV | any;
  enclosed_indices: [number, number];
  entity_id: number;
  entities: Array<OsisSubEntity>;
}

export interface OsisSubEntity {
  start: BCV;
  end: BCV;
  valid: {
    valid: boolean;
    messages: any;
  };
  type: 'bcv' | 'bc' | 'cv' | 'integer' | 'range';
  absolute_indices: [number, number];
  enclosed_absolute_indices: [number, number];
}

export interface BCV {
  b: string;
  c: number;
  v: number;
}
