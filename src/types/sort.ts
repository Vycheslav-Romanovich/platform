export type SortByEnglishLevelType = '' | 'all' | 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';

export type SortByCreatedType = 'all' | 'user' | 'elang' | 'teachers';

export type SortByNumberOfTermsType = '5-10' | '10-20' | '>20' | 'all';

export type SortByContentType = 'video' | 'own-words' | 'all';

export type SortByOrderType =
  | 'date:desc'
  | 'date:asc'
  | 'alfabet:desc'
  | 'alfabet:asc'
  | 'rating:desc';

export type LessonSortDataType = {
  search?: string;
  level?: SortByEnglishLevelType;
  created?: SortByCreatedType;
  numberOfTerms?: SortByNumberOfTermsType;
  type?: SortByContentType;
  page?: number;
  order?: SortByOrderType;
  pageSize?: number;
  classId?: number;
  isTeacherClass?: boolean;
};
