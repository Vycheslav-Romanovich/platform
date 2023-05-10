import autoBind from 'auto-bind';
import { action, makeAutoObservable, observable } from 'mobx';

import { lessonStore, userStore } from '.';

import api from '~/api_client/api';
import {
  progressActivitiesDataWithNullData,
  progressActivitiesDataWithNullDataClass,
} from '~/constants/progressActivities';
import { IAddTeacherClassRequest, IAddTeacherClassResponse } from '~/types/api';
import {
  IAddTeacherLesson,
  IClassData,
  IClassDataId,
  ILessonStatisticsData,
  ITeacherClassStatistic,
} from '~/types/teacherClass';

export default class TeacherClassesStore {
  @observable teacherClass: IAddTeacherClassResponse = null;
  @observable teacherClassData: IAddTeacherClassResponse[] | null = [];
  @observable defaultTeacherClassProgress: IAddTeacherClassResponse | null;
  @observable teacherClassDataAll: IAddTeacherClassResponse[] | null = [];
  @observable statisticStudent: ITeacherClassStatistic[] | null = [];
  @observable classesData: IClassData[] | null = [];
  @observable classDataId: IClassDataId = null;
  @observable isEditClassModal = false;
  @observable isTeacherClass = false;
  @observable hasJoined = false;
  @observable isInviteStudentsModal = false;
  @observable deleteId: number = null;
  @observable lessonPercentProgress: number = null;
  @observable dataForTeacherLesson: ILessonStatisticsData | null = null;
  @observable isDoneActive = false;
  @observable myLessonPath = '/lessons?q=created';

  constructor() {
    autoBind(this);
    makeAutoObservable(this);
  }

  @action setMyLessonPath(str: string) {
    this.myLessonPath = str;
  }

  @action toggleDoneButton(data: boolean) {
    this.isDoneActive = data;
  }

  @action async postTeacherClass(data: IAddTeacherClassRequest) {
    const resp = await api.postTeacherClasses(data);
    this.teacherClass = resp.data.data;
    return resp.data.data;
  }

  @action async updateTeacherClass(data: IAddTeacherClassRequest, classId: number) {
    const resp = await api.updateTeacherClasses(data, classId);
    return resp;
  }

  @action private checkClassOwner() {
    this.teacherClassData[0].teacherId === userStore.user.id
      ? (this.isTeacherClass = true)
      : (this.isTeacherClass = false);
  }

  @action async getTeacherClassData(classId: number) {
    this.myLessonPath = '/lessons?q=created';
    lessonStore.isLoadingLessons = 'true';
    try {
      const resp = await api.getTeacherClassDataById(classId);
      this.teacherClassData = [resp.data];
      if (userStore.isAuth) {
        if (resp.data.teacherId !== userStore.user.id) {
          const filteredStatistics = resp.data.students
            .map((item) => {
              if (item.user.id === userStore.user.id) {
                const stat = item.teacherClasses.teacherLessons.map(({ statistics }) => {
                  return statistics.find((i) => {
                    return i.studentId === item.id;
                  });
                });
                return stat.map((item) => {
                  if (item) {
                    return item;
                  } else {
                    return [];
                  }
                });
              }
            })
            .filter((item) => item)[0];

          const studentAllStatistic = resp.data.teacherLessons.map((item) => {
            let statData;
            if (filteredStatistics) {
              statData = filteredStatistics.find((stat) => {
                return stat.teacherLesson === item.id;
              });
            } else {
              return statData;
            }
            if (statData) {
              return {
                ...item,
                statistics: [statData],
              };
            } else {
              return {
                ...item,
                statistics: [],
              };
            }
          });
          this.statisticStudent = studentAllStatistic;
        }

        const mappedStudentData = resp.data.students.map((student) => {
          const lessonsData = student.teacherClasses.teacherLessons.map((lesson) => {
            const filteredStat = lesson.statistics.map((stat) => {
              if (stat.studentId === student.id) {
                return stat;
              } else {
                return [];
              }
            });
            return filteredStat.flat();
          });
          return {
            ...student.user,
            studentId: student.id,
            lessons: lessonsData,
          };
        });

        const finalTeacherClassData = resp.data.teacherLessons
          .map((lessonData) => {
            return {
              ...lessonData.lesson,
              teacherLessonId: lessonData.id,
              students: mappedStudentData,
            };
          })
          .map((teacherLesson) => {
            const studentsData = teacherLesson.students.map((studentData) => {
              const statisticData = studentData.lessons
                .map((item) => {
                  if (item.length > 0 && item[0].teacherLesson === teacherLesson.teacherLessonId) {
                    return item[0];
                  }
                })
                .filter((item) => item)
                .flat();
              return {
                ...studentData,
                lessons: statisticData,
              };
            });
            return {
              ...teacherLesson,
              students: studentsData,
            };
          });
        this.teacherClassDataAll = finalTeacherClassData;
        this.setDefaultTeacherClassProgress(finalTeacherClassData[0]);
        await this.checkClassOwner();
        await this.setHasJoined();
      }
    } catch (error) {
      console.log(error);
    } finally {
      lessonStore.isLoadingLessons = 'false';
    }
  }

  @action writeClassDataId(classId: number) {
    this.classDataId = { classId };
  }

  @action async deleteTeacherClasses(classId: number) {
    return await api.deleteTeacherClass(classId);
  }

  @action setIsEditClassModal(state: boolean) {
    this.isEditClassModal = state;
  }
  @action async addTeacherLesson(data: IAddTeacherLesson) {
    const res = await api.addTeacherLesson(data);
    return res.data;
  }

  @action setDefaultTeacherClassProgress(data: IAddTeacherClassResponse) {
    this.defaultTeacherClassProgress = data;
  }

  @action async deleteTeacherLesson(lessonId: number) {
    return await api.deleteTeacherLesson(lessonId);
  }

  @action async joinTeacherClass(classId: number) {
    try {
      return await api.joinTeacherClass({ id: classId });
    } catch (error) {
      console.log(error);
    }
  }

  @action async getClassesByUserId() {
    try {
      const resp = await api.getClassesByUserId();
      this.classesData = [resp.data];
      return resp.data.teacherClasses.length;
    } catch (error) {
      console.log(error);
    }
  }

  @action async deleteStudentFromClass(classId: number, studentId: number) {
    return await api.deleteStudentFromClass(classId, studentId);
  }

  @action private setHasJoined() {
    this.teacherClassData[0]?.students.some((student) => student.user.id === userStore.user.id)
      ? (this.hasJoined = true)
      : (this.hasJoined = false);
  }

  @action toggleInviteStudentsModal(state: boolean) {
    this.isInviteStudentsModal = state;
  }

  @action async updateStatisticsEdu(data: ILessonStatisticsData) {
    try {
      return await api.updateStatisticsEdu({ ...data });
    } catch (error) {
      console.log(error);
    }
  }

  @action writeDeleteId(id: number) {
    this.deleteId = id;
  }

  @action resetProgress() {
    this.lessonPercentProgress = 0;
  }

  @action setLessonPercentProgress(data: ILessonStatisticsData, isClassStat?: boolean) {
    if (data) {
      const allResults = Object.keys(
        !isClassStat
          ? progressActivitiesDataWithNullData[0]
          : progressActivitiesDataWithNullDataClass[0]
      )
        .map((item) => {
          //in case u need percent use this code below, >0 counts the percent of completed tasks
          // if (lessonStore.lessonData?.statistic[item] === true) {
          if (+data[item] > 0) {
            return 100;
          } else if (data[item] === null) {
            return NaN;
          } else {
            return +data[item];
          }
        })
        .filter((item) => !isNaN(item));

      const statToReturn =
        allResults.reduce((acc, cur) => {
          return acc + cur;
        }, 0) / allResults.length;

      if (!isClassStat) {
        this.lessonPercentProgress = Math.round(statToReturn);
      } else {
        return `${Math.round(statToReturn)} %`;
      }
    }
  }
}
