export interface Group {
  id: number;
  form: string;
}

export interface TranslateType {
  en: string;
  ar: string;
  ru: string;
  es: string;
  zh: string;
  de: string;
  tr: string;
}

export interface Verbs {
  id: number;
  verb: string;
  formVerbs: string[];
  translate: TranslateType;
  group: Group[];
}

export interface MessagesInterface {
  id: number;
  fromName: string;
  rating: number;
  access: boolean;
  nextAccess: boolean;
  list: string[];
  verbs: Verbs[];
}

export interface SetWordsListType {
  id: string;
  wordId: number;
  word: string;
}
