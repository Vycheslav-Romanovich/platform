export interface Idioms {
  foundIdioms: {
    example: string;
    examples: string[];
    idiom: string;
    meaning: string;
    meanings: string[];
    index: number;
  }[];
  foundIdiomPosition: [number, number][];
}

export interface OneSubtitle {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  translation: string;
  idioms?: Idioms;
}

export interface Subtitles {
  id: number;
  lang: string;
  name?: string;
  subtitles: OneSubtitle[];
}

export type ActionMode =
  | null
  | 'repeat'
  | 'slow repeat'
  | 'prev'
  | 'next'
  | 'translateOn'
  | 'translateOff';
