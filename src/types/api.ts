import { SortByEnglishLevelType } from './sort';
import {
  IAddTeacherLesson,
  IAddTeacherLessonResponse,
  ILessonStatisticsData,
  IStudentData,
} from './teacherClass';
import { VideoGameDto } from './video';

import { Idioms } from '~/types/subtitles';

export interface ServerError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface DefaultResponse {
  message: string;
}

export interface IUsage {
  translationsCounter: number;
  tutorUsageCounter: number;
  planType: PlanType;
  planExpiration: Date;
}

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  email: string;
  password: string;
  from?: string;
  to?: string;
  role?: 'student' | 'teacher';
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface InfoResponse {
  avatarUrl: string | null;
  email: string;
  from: string;
  hadExtensionLogin: boolean;
  id: number;
  isLangPairChoose: boolean;
  name: string | null;
  planExpiration: string;
  planType: PlanType;
  to: string;
}

export interface RecoveryPasswordResponse {
  message: 'SENT_RECOVERY_LINK';
}

export interface AddLesson {
  name: string;
  from?: string;
  to?: string;
  url?: string;
  mediaUrl?: string;
  parentId?: number;
}

export interface LessonOwner {
  avatarUrl: string | null;
  name: string;
}

export interface sharedLessons {
  id: number;
  lessonId: number;
  userId: number;
}
export interface GameLesson {
  id: number;
  userId: string;
  gameType:
    | 'choose_the_variant'
    | 'matching_pairs'
    | 'fillwords'
    | 'fill_blank'
    | 'speech_training';
  complete: CompleteGameType;
  lessonId: number;
  bestValue?: number;
  currentValue?: number;
}

export type CompleteGameType = 'done' | 'notDone' | null;

export interface AddLessonResponse extends AddLesson {
  id?: number;
  picture: string;
  level: SortByEnglishLevelType;
  word: (WordPair | AddWordResponse)[];
  sentencesCount?: number;
  userId?: number;
  sentences?: AddSentenceResponse[];
  sharedLessons?: sharedLessons[];
  favoriteLessons?: FavoriteLessons[];
  user?: LessonOwner;
  wordsCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  videoGame?: VideoGameDto[];
  game?: GameLesson[];
  avgRating?: number;
  numberVoters?: string;
  TeacherLesson?: IAddTeacherLesson;
  statistic?: ILessonStatisticsData;
  teacherClasses?: TeacherClassesIds[];
  private?: boolean;
  teacherId?: number;
  teacherClassName?: string;
}

interface TeacherClassesIds {
  id: number;
}

interface FavoriteLessons {
  id: number;
  lessonId: number;
}

export interface PublicLessonResponse {
  totalResults: number;
  data: AddLessonResponse[];
}

export interface IdiomsSentenceResponse {
  sentence: string;
  sentenceID: number;
  idioms: Idioms;
}

export interface IdiomsSentenceRequest {
  sentence: string;
  sentenceID: number;
}

export interface WordUpdateRequest {
  word: string;
  translate: string;
}

export interface AddSentence {
  words: [number, number][];
  lessonId: number;
  text: string;
  from?: string;
  to?: string;
  videoTimestamp?: number;
  videoTimestampEnd?: number;
}

export interface AddSentenceResponse extends AddSentence {
  id: number;
  createdAt: Date;
  updateAt: Date;
  wordsNew?: AddWordResponse[];
}

export type durationType = 'any' | 'short' | 'medium' | 'long';
export type OrderType = 'date' | 'rating' | 'relevance' | 'title' | 'viewCount';

export interface AddWord {
  word: string;
  index: number;
  length: number;
  translate: string;
  sentenceId?: number;
  lessonId?: number;
  transcription?: string;
  wrongTranslations?: string[];
}

export type WordId = number;

export interface DeleteWordResponse {
  message: string;
  word: AddWordResponse;
}

export interface AddWordResponse extends AddWord {
  id: number;
  createdAt?: Date;
  updateAt?: Date;
  attempts?: number;
  passes?: number;
}

export type PlanType = 'PREMIUM' | 'REGULAR' | 'YEARLY' | 'MONTHLY';

export interface IUserAvatar {
  id: number;
  name: string | null;
  avatar: string | null;
}

export interface IUserInfo {
  id: number;
  name: string | null;
  email?: string | null;
  token?: string;
  googleId: string | null;
  facebookId: string | null;
  avatar: string | null;
  type?: string;
  planType: PlanType;
  planExpiration?: Date;
  from?: string;
  to?: string;
  role?: 'teacher' | 'student';
  hadExtensionLogin?: boolean;
  isLangPairChoose?: boolean;
  interestTags?: Array<string>;
  isActivePremium: boolean;
  limits: UserActivity;
}

export type UserActivity = {
  studentsInClassCounter: number;
  ownLessonCounter: number;
  tutorUsageCounter: number;
  translationsCounter: number;
};

export type Token = string;

export interface DeleteLessonWithWordPairs {
  lessonWithWordsId: number;
}

export interface CurrentLesson {
  url: string;
  mediaUrl: string;
  name: string;
}

export interface WordPair {
  id?: number;
  word: string;
  translate: string;
}

export interface IAddWord {
  sentence: {
    text: string;
    videoTimestamp: number;
    videoTimestampEnd: number;
    id?: number;
    words?: [number, number][];
  };
  word: {
    word: string;
    index: number;
    length: number;
    translate: string;
    id?: number;
    isIdiom?: boolean;
  };
}

export interface LessonFull {
  lesson: AddLessonResponse;
  sentenceAndWords: IAddWord[];
  videoGame: VideoGameDto[];
}

export interface sendFrom {
  email: string;
  name: string;
}

export interface SenderObject {
  email: string;
  subject: string;
  to: string;
  from: sendFrom;
}

export interface DecodeToken {
  name: string;
  exp: number;
}

export interface UpdateUserResponse {
  message: 'UPDATE_USER';
  user: IUserInfo;
}

export interface WordInfo {
  text: string;
  clientRect: DOMRect;
  selectedIdioms: Idioms;
  index: number;
  addedWordInfo?: AddWordResponse[];
}

export interface WordViewData {
  text: string;
  id: string;
  idiomIds: number[];
  addedWordInfo?: AddWordResponse[];
}

export interface IWordObject {
  word: string;
  translation: string;
  transcription: string;
  synoyms: Array<string>;
  partOfSpeech: string;
  allPartOfSpeech: {
    noun: AllPartOfSpeech[];
    verb: AllPartOfSpeech[];
  };
  example: Array<string>;
}

export interface AllPartOfSpeech {
  translation: string;
  frequency: number;
  synonyms: string[];
}

export interface IAddTeacherClassResponse {
  id?: number;
  avatarUrl: string | null;
  name: string | null;
  level?: SortByEnglishLevelType;
  teacherLessons?: IAddTeacherLessonResponse[];
  students?: IStudentData[];
  teacherId?: number;
  teacher?: InfoResponse;
}

export interface IAddTeacherClassRequest {
  name: string | null;
  avatarUrl?: File;
}
