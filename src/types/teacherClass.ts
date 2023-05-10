import { AddLessonResponse, InfoResponse } from './api';

export interface IStudentData {
  id: number;
  name?: string;
  user?: StudentData;
  avatarUrl?: string | null;
  studentId?: number;
  lessons?: ILessonStatisticsData[];
}
[];

export interface StudentData {
  id: number;
  name: string;
  avatarUrl: string;
}
export interface IClassDataId {
  classId: number;
}
export interface IClassDataParams {
  id: number;
  classId: number;
  teacherClasses: IClass;
}

export interface IClassData {
  studentClasses: IClassDataParams[];
  teacherClasses: IClass[];
}
[];
export interface IAddTeacherLesson {
  id?: number;
  classId: number;
  lessonId: number;
}

export interface ILessonStatisticsData {
  id?: number;
  teacherLessonId: number;
  classId: number;
  videoGame?: number | null;
  speechTraining?: number | null;
  matchingPairs?: number | null;
  fillWords?: number | null;
  fillBlank?: number | null;
  chooseVariant?: number | null;
}

export interface IGetStatistics {
  lessonId: number;
  classId: number;
}
export interface IClass {
  id: number;
  teacherId: number;
  name: string;
  avatarUrl: string;
  level: string;
  teacher: InfoResponse;
  students: IStudentData[];
  lessonId: number;
  teacherLessons: Array<TeacherLesson>;
}

export interface TeacherLesson {
  lessonId: number;
}

export interface IAddTeacherLessonResponse {
  id?: number;
  lesson: AddLessonResponse;
  statistics: ILessonStatisticsData | [];
}
export interface ITeacherClassStatistic {
  id?: number;
  lessonId: number;
  classId: number;
  lesson: AddLessonResponse;
  statistics: ILessonStatisticsData[] | [];
}

export interface ICheckUserAuthTeacherLesson {
  isUserAuth: boolean;
  linkToCopy: string;
}
