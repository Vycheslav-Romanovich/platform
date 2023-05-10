import axios from 'axios';

import { lessonStore, userStore, videoStore } from '~/stores';
import {
  AddLessonResponse,
  AddSentence,
  AddSentenceResponse,
  AddWord,
  AddWordResponse,
  DefaultResponse,
  DeleteLessonWithWordPairs,
  DeleteWordResponse,
  durationType,
  IAddTeacherClassRequest,
  IdiomsSentenceRequest,
  IdiomsSentenceResponse,
  IUserAvatar,
  IUserInfo,
  IWordObject,
  LessonFull,
  Login,
  OrderType,
  PublicLessonResponse,
  RecoveryPasswordResponse,
  Register,
  RegisterResponse,
  SenderObject,
  Token,
  UpdateUserResponse,
  WordId,
  WordPair,
  WordUpdateRequest,
} from '~/types/api';
import { LessonSortDataType } from '~/types/sort';
import { Subtitles } from '~/types/subtitles';
import { IAddTeacherLesson, ILessonStatisticsData } from '~/types/teacherClass';
import { ResponseVideoType } from '~/types/video';

const apiServer = process.env.PRODUCT_SERVER_URL;
export const apiSubtitlesServer = process.env.PRODUCT_SERVER_RECOMENDED_VIDEO_URL;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAllVideosWithInterests: async () => {
    const resp = await axios.get(`${apiSubtitlesServer}/api/v1/interests/allWithVideos`);
    const respRecommendedVideos: ResponseVideoType = resp.data;
    return respRecommendedVideos;
  },
  login: (userData: Login) => {
    return axios.post<IUserInfo>(`${apiServer}/api/auth/login`, userData);
  },
  googleOauth: (userData: {
    appService: string;
    accessToken: Token;
    role?: 'student' | 'teacher';
    to?: string;
  }) => {
    return axios.post<IUserInfo>(`${apiServer}/api/auth/googleOauth`, userData);
  },
  register: (userData: Register) => {
    return axios.post<RegisterResponse>(`${apiServer}/api/auth/register`, userData);
  },
  sendPassword: (email: string) => {
    return axios.post<RecoveryPasswordResponse>(`${apiServer}/api/auth/sendPassword`, {
      email,
      platformUrl: process.env.CURRENT_SITE_URL,
    });
  },

  getVideoById: async (id: string) => {
    return await axios.get(`${apiServer}/api/v2/search/video/${id}`);
  },

  sendReqChangePassword: (pass: string, token: string) => {
    return axios.post(
      `${apiServer}/api/auth/resetPassword`,
      {
        token,
        pass,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
  searchVideosByInterest: async (interest: number, nextPageToken = '') => {
    const resp = await axios.get(
      `${apiSubtitlesServer}/api/v1/video/byInterest?interest=${interest}${
        nextPageToken ? '&nextPageToken=' + nextPageToken : ''
      }`
    );
    return resp.data;
  },

  search: async (
    keyword: string,
    nextPageToken = '',
    duration: durationType,
    order: OrderType,
    from = userStore.user?.from || 'en'
  ) => {
    const resp = await axios.get(
      `${apiServer}/api/v2/search?keyword=${keyword}${
        nextPageToken ? '&nextPageToken=' + nextPageToken : ''
      }${from ? `&from=${from}` : ''}&duration=${duration}&order=${order}&eduSearch='true'`
    );
    return resp.data;
  },

  info: (token: Token) => {
    return axios.get<IUserInfo>(`${apiServer}/api/users/info`, {
      headers: {
        Authorization: token,
      },
    });
  },

  getLanguages: () => {
    return axios.get(`${apiServer}/api/translation/languages`);
  },
  getIdiomsSentence: (arrText: IdiomsSentenceRequest[]) => {
    return axios.post<{ foundIdiomsArray: IdiomsSentenceResponse[] }>(
      `${apiServer}/api/v2/idiom/text`,
      {
        foundIdiomsArray: arrText,
      }
    );
  },
  newLibralySubTranslate: async (
    id: string,
    subStart?: number,
    subEnd?: number,
    lang = userStore.user?.to || lessonStore.lessonData.to || 'ru',
    from = userStore.user?.from || 'en'
  ) => {
    const resp = await axios.get<Subtitles>(
      `${apiServer}/api/subtitle/translated?id=${id}&lang=${lang}${from ? `&from=${from}` : ''}${
        subStart.toString() ? `&subStart=${subStart}` : ''
      }${subEnd ? `&subEnd=${subEnd}` : ''}`
    );
    return resp.data;
  },

  translate: async (req: { text: string; to?: string; from?: string }) => {
    const body: {
      text: string;
      from?: string;
      to?: string;
    } = {
      text: `${req.text}`,
    };
    if (req.from) {
      body.from = req.from;
    } else {
      body.from = userStore.user?.from || 'en';
    }
    if (req.to) {
      body.to = req.to;
    } else {
      body.to = userStore.user?.to || lessonStore.lessonData?.to || 'ru';
    }

    const resp = await axios.post<{ translation: string }>(`${apiServer}/api/translation`, body, {
      headers: {
        'translate-app-id': 'b343f4eb2e1cf0d3f0f14ce30649db2fb1e0db28',
        'machine-id': '3c986984-6646-430e-9d28-b041cd5dcf89',
        Authorization: userStore.user.token,
      },
    });
    return resp.data.translation;
  },

  translateSynonyms: async (word: string) => {
    const from = userStore.user?.from || 'en';
    const to = userStore.user?.to || lessonStore.lessonData?.to || 'ru';
    const resp = await axios.get<IWordObject>(
      `${apiServer}/api/vocabulary-translate/word` +
        `?` +
        `text=${encodeURIComponent(word)}` +
        `&from=${from}` +
        `&to=${to}`,
      {
        headers: {
          'translate-app-id': 'b343f4eb2e1cf0d3f0f14ce30649db2fb1e0db28',
          'machine-id': '3c986984-6646-430e-9d28-b041cd5dcf89',
        },
      }
    );

    const result = Object.values(resp.data.allPartOfSpeech)
      .flat()
      .filter((item) => item.frequency <= 2)
      .slice(0, 3);

    return result;
  },

  subtitles: async (id: string, from = userStore.user?.from || 'en') => {
    const resp = await axios.get<Subtitles[]>(
      `${apiServer}/api/v2/search/subtitles?id=${id}${from ? `&from=${from}` : ''}`
    );
    const subtitlesResp: Subtitles[] = resp.data;
    return subtitlesResp;
  },

  getWords: async () => {
    return await axios.get<AddLessonResponse[]>(`${apiServer}/api/v2/words/all`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  newLibralySubtitles: async (id: string) => {
    const from = userStore.user?.from ? userStore.user?.from : 'en';
    const to = userStore.user?.to || lessonStore.lessonData?.to || 'ru';
    const resp = await axios.get<Subtitles>(
      `${apiServer}/api/subtitle?id=${id}${from ? `&from=${from}` : ''}${to ? `&to=${to}` : ''}`
    );
    const subtitlesResp: Subtitles[] = [resp.data];

    videoStore.setId(subtitlesResp[0].id.toString());
    videoStore.setCharacters(
      subtitlesResp[0].subtitles
        .map((m) => (m.text ? m.text.length : 0))
        .reduce(function (sum, elem) {
          return sum + elem;
        }, 0)
    );
    return subtitlesResp;
  },

  addFullLesson: (lessonDto: LessonFull, coverFile?: File) => {
    const formData = new FormData();
    formData.append('cover', coverFile);
    formData.append('data', JSON.stringify(lessonDto));

    return axios.post<{ message: string; lessonData: AddLessonResponse }>(
      `${apiServer}/api/lessons/fullLesson`,
      formData,
      {
        headers: { Authorization: userStore.user.token },
      }
    );
  },

  putFullLesson: (lessonDto: LessonFull, coverFile?: File) => {
    const formData = new FormData();
    formData.append('cover', coverFile);
    formData.append('data', JSON.stringify(lessonDto));

    return axios.put<{ message: string; lessonData: AddLessonResponse }>(
      `${apiServer}/api/lessons/fullLesson`,
      formData,
      {
        headers: { Authorization: userStore.user.token },
      }
    );
  },

  getLessonById: (lessonId: number) => {
    return axios.get<AddLessonResponse>(
      `${apiServer}/api/lessons/${lessonId}${userStore.user ? `?userId=${userStore.user.id}` : ''}`
    );
  },

  updateLesson: (lesson: AddLessonResponse, lessonId: number) => {
    return axios.put(`${apiServer}/api/lessons/${lessonId}`, lesson, {
      headers: { Authorization: userStore.user.token },
    });
  },
  updateWord: (word: WordUpdateRequest, wordId: number) => {
    return axios.put(`${apiServer}/api/v2/words/${wordId}`, word, {
      headers: { Authorization: userStore.user.token },
    });
  },

  addLesson: async (data: AddLessonResponse) => {
    return await axios.post<AddLessonResponse>(`${apiServer}/api/lessons`, data, {
      headers: { Authorization: userStore.user.token },
    });
  },

  addSentence: async (data: AddSentence) => {
    return await axios.post<{ message: string; sentence: AddSentenceResponse }>(
      `${apiServer}/api/sentences`,
      data,
      {
        headers: { Authorization: userStore.user.token },
      }
    );
  },

  delete: (id: WordId) => {
    return axios.delete<DeleteWordResponse>(`${apiServer}/api/v2/words/${id}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  addWord: (data: AddWord) => {
    return axios.post<{
      message: string;
      word: AddWordResponse;
      updatedSentence: AddSentenceResponse;
    }>(`${apiServer}/api/v2/words`, data, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getUserAvatar: (userId: number) => {
    return axios.get<IUserAvatar>(`${apiServer}/api/users/${userId}/avatar`);
  },

  getLessons: () => {
    return axios.get(`${apiServer}/api/lessons`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  deleteLessonId: (lessonWithWordsId: number) => {
    return axios.delete<DeleteLessonWithWordPairs>(
      `${apiServer}/api/lessons/${lessonWithWordsId}`,
      {
        headers: { Authorization: userStore.user.token },
      }
    );
  },

  deleteVideoLesson: async (id: number) => {
    return await axios.delete(`${apiServer}/api/lessons/${id}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  postLessonWithWordPairsNew: (pairData: WordPair[], lessonId: number) => {
    return axios.post<AddLessonResponse>(
      `${apiServer}/api/v2/words/byPairs/${lessonId}`,
      pairData,
      {
        headers: { Authorization: userStore.user.token },
      }
    );
  },

  updateLessonWithWordsNew: (
    lessonId: number,
    word: { id?: number; word: string; translate: string }[]
  ) => {
    return axios.put<WordPair[]>(`${apiServer}/api/v2/words/byPairs/${lessonId}`, word, {
      headers: { Authorization: userStore.user.token },
    });
  },

  sendMenagerEmail: (body: SenderObject) => {
    return axios.post(`${apiServer}/api/mailer/sendDefaultEmail`, body);
  },

  updateUser: (body: Partial<IUserInfo>) => {
    return axios.put<UpdateUserResponse>(`${apiServer}/api/users`, body, {
      headers: { Authorization: userStore.user.token },
    });
  },

  updateAvatar: (body: { avatarUrl: string }) => {
    return axios.put<UpdateUserResponse>(`${apiServer}/api/users`, body, {
      headers: { Authorization: userStore.user.token },
    });
  },

  updateUserTo: (body: { to: string }) => {
    return axios.put<UpdateUserResponse>(`${apiServer}/api/users`, body, {
      headers: { Authorization: userStore.user.token },
    });
  },

  deleteAccount: () => {
    return axios.post<DefaultResponse>(`${apiServer}/api/auth/deleteAccount`, null, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getAllLessons: (lessonId: number) => {
    return axios.get(`${apiServer}/api/v2/words/byPair/${lessonId}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  postSharedLessonById: (data: { lessonIds: Array<number> }) => {
    return axios.post(`${apiServer}/api/shared-lessons/students`, data, {
      headers: { Authorization: userStore.user.token },
    });
  },

  postFavoriteLesson: (data: { lessonId: number }) => {
    return axios.post(`${apiServer}/api/favorite-lessons`, data, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getSharedLessons: async () => {
    return await axios.get<AddLessonResponse[]>(`${apiServer}/api/shared-lessons`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  deleteFavoriteLesson: async (id: number) => {
    return await axios.delete(`${apiServer}/api/favorite-lessons/${id}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getFavoriteLessons: async () => {
    return await axios.get<AddLessonResponse[]>(`${apiServer}/api/favorite-lessons`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  postNewAvatar(avatar: File) {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return axios.post(apiServer + '/api/upload/avatar', formData, {
      headers: { Authorization: userStore.user.token },
    });
  },

  updateLessonName: async (data: { name: string }, lessonId: number) => {
    return await axios.put(`${apiServer}/api/lessons/${lessonId}`, data, {
      headers: { Authorization: userStore.user.token },
    });
  },

  changePassword: (oldPassword: string, newPassword: string) => {
    return axios.post<DefaultResponse>(
      `${apiServer}/api/auth/changePassword`,
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        headers: { Authorization: userStore.user.token },
      }
    );
  },

  deleteSharedLesson: (sharedLessonId: number) => {
    return axios.delete<AddLessonResponse>(`${apiServer}/api/shared-lessons/${sharedLessonId}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getPublicLessons: (lessonSortData?: LessonSortDataType) => {
    let searchParam = '';

    if (lessonSortData) {
      const { search, level, created, numberOfTerms, type, page, order, pageSize, isTeacherClass } =
        lessonSortData;
      searchParam = `?${search ? `&search=${search}` : ''}${level ? `&level=${level}` : ''}${
        created ? `&created=${created}` : ''
      }${numberOfTerms ? `&numberOfTerms=${numberOfTerms}` : ''}${type ? `&type=${type}` : ''}${
        page ? `&page=${page}` : ''
      }${order ? `&order=${order}` : ''}${pageSize ? `&pageSize=${pageSize}` : ''}${
        isTeacherClass ? `&isTeacherClass=${isTeacherClass}` : ''
      }`;
    }

    return axios.get<PublicLessonResponse>(`${apiServer}/api/lessons/public${searchParam}`);
  },

  getPublicLessonsFromString: (lessonSortData: string) => {
    return axios.get<PublicLessonResponse>(`${apiServer}/api/lessons/public${lessonSortData}`);
  },

  sendSupportMail: (req: { text: string; name: string; from: string; subject: string }) => {
    return axios.post(`https://easy4learn.com/api/mailer/support`, req);
  },

  getUserInfoByGoogleId: (googleId: string) => {
    return axios.get<{
      id: string;
      name: string;
      avatar: string;
      email: string;
      googleId: string;
    }>(`${apiServer}/api/users/session/${googleId}`);
  },

  postTeacherClasses: (data: IAddTeacherClassRequest) => {
    const formData = new FormData();

    formData.append('cover', data.avatarUrl);
    formData.append('name', data.name);

    return axios.post(`${apiServer}/api/teacher-class`, formData, {
      headers: { Authorization: userStore.user.token },
    });
  },

  updateTeacherClasses: (data: IAddTeacherClassRequest, classId: number) => {
    const formData = new FormData();

    formData.append('cover', data.avatarUrl);
    formData.append('name', data.name);

    return axios.put(`${apiServer}/api/teacher-class/${classId}`, formData, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getTeacherClasses: () => {
    return axios.get(`${apiServer}/api/teacher-class`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getTeacherClassDataById: (classId: number) => {
    return axios.get(`${apiServer}/api/teacher-class/${classId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  deleteTeacherClass: (classId: number) => {
    return axios.delete(`${apiServer}/api/teacher-class/${classId}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  addTeacherLesson: (data: IAddTeacherLesson) => {
    return axios.post(`${apiServer}/api/teacher-lesson`, data, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getTeacherLessonData: (lessonId: number, classId: number) => {
    return axios.get(`${apiServer}/api/teacher-lesson/${lessonId}?classId=${classId}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getTeacherLessonsByClassIdUserId: (classId: number) => {
    return axios.get(`${apiServer}/api/teacher-lesson/student/${classId}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  deleteTeacherLesson: (lessonId: number) => {
    return axios.delete(`${apiServer}/api/teacher-lesson/${lessonId}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  joinTeacherClass: (data: { id: number }) => {
    return axios.post(`${apiServer}/api/students`, data, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getStudentsByClassId: (classId: number) => {
    return axios.get(`${apiServer}/api/students/${classId}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getClassesByUserId: () => {
    return axios.get(`${apiServer}/api/students`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  deleteStudentFromClass: (classId: number, studentId: number) => {
    return axios.delete(`${apiServer}/api/students/${classId}/${studentId}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  postLessonRating: (data: { lessonId: number; rating: number }) => {
    return axios.post(`${apiServer}/api/rating/`, data, {
      headers: { Authorization: userStore.user.token },
    });
  },

  addStatistics: (data: ILessonStatisticsData) => {
    return axios.post(`${apiServer}/api/statisticsEdu`, data, {
      headers: { Authorization: userStore.user.token },
    });
  },

  updateStatisticsEdu: (data: ILessonStatisticsData) => {
    return axios.put(`${apiServer}/api/statisticsEdu`, data, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getStatisticLessonEduByUser: (lessonId: number) => {
    return axios.get(`${apiServer}/api/statisticsEdu/lesson/${lessonId}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getStatisticClassEduByUser: (classId: number) => {
    return axios.get(`${apiServer}/api/statisticsEdu/class/${classId}`, {
      headers: { Authorization: userStore.user.token },
    });
  },

  getStatisticEduByWholeLesson: (lessonId: number, classId: number) => {
    return axios.get(`${apiServer}/api/statisticsEdu/students/${lessonId}/${classId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  setInSendPulseBook: (body: { email: string; bookId: number }) => {
    axios.post(`${apiServer}/api/sendpulse/addEmailtoList`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  removeFromSendPulseBook: (body: { email: string; bookId: number }) => {
    return axios.post(`${apiServer}/api/sendpulse/removeEmailFromList`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};
