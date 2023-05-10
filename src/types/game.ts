export interface AddLessonResponse {
  id: number;
  title: string;
  videoUrl: string;
  word: string;
  sentence: string;
  interval: number | null;
  isGuessed: number;
  wordId: number;
  translate: string;
}

export interface WordsPair {
  id: number;
  index: number;
  length: number;
  translate: string;
  word: string;
}

export type ChooseGamePages = 'game' | 'finish' | 'leave';

export type FillwordData = {
  id: number;
  themeId: number;
  level: number;
  levelInTheme: number;
  isWin?: boolean;
  words: WordData[];
  board: string[][];
};

export type WordData = {
  id: number;
  level: number;
  translate: string;
  word: string;
  connection: [number, number][];
  prompt?: string[];
};

export type GlobalWord = {
  selectWords: {
    [wordLengt: number]: WordData[];
  };
};

export interface VideoGameDto {
  timeCode: number;
  gameType: VideoGameType;
  question: string;
  answer?: VideoGameAnswerType;
}

export type VideoGameAnswerType = { correct: string[] | boolean; option?: string[] };

export type VideoGameType = 'true_or_false' | 'open_end_question' | 'multiple_choice';
