import autoBind from 'auto-bind';
import { action, computed, makeAutoObservable, observable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

import api from '~/api_client/api';
import { gameBlock } from '~/constants/blocks';
import { PAGE_SIZE } from '~/constants/variable';
import {
  hintTranslationStore,
  lessonStore,
  openEndedGameStore,
  sortStore,
  userStore,
  videoStore,
} from '~/stores/index';
import {
  AddLessonResponse,
  AddWordResponse,
  CurrentLesson,
  IAddWord,
  PublicLessonResponse,
  WordPair,
} from '~/types/api';
import { LessonSortDataType, SortByEnglishLevelType } from '~/types/sort';
import { StatisticType, VideoGameDto, VideoGameType } from '~/types/video';

export interface deleteLessonData {
  lessonId: number;
  isShared: boolean;
  isFavorite: boolean;
}

type CheckAnswerType = {
  trueFalseAnswer: { answer: boolean; id: number | string }[];
  chooseOptionAnswer: string[];
};

export default class LessonStore {
  @observable lessons: AddLessonResponse[] = [];
  @observable sharedLessons: AddLessonResponse[] = [];
  @observable favoriteLessons: AddLessonResponse[] = [];
  @observable sharedLessonOwners: AddLessonResponse[] = [];
  @observable lessonsPublic: PublicLessonResponse = { totalResults: 0, data: [] };
  @observable lessonData: AddLessonResponse | null = null;
  @observable videoGameData: VideoGameDto[] = [];
  @observable statisticArrayProcent: VideoGameDto[] = [];
  @observable sortVideoGameData: VideoGameDto[] = [];

  @observable statisticLessonData: StatisticType[] = [];
  @observable timeCodeStatisticPercent: number = null;

  @observable sentenseWithWordData: IAddWord[] = [];
  @observable checkAnswer: CheckAnswerType = { trueFalseAnswer: [], chooseOptionAnswer: [] };

  @observable videoInteractiveName: VideoGameType | null = null;

  @observable paginationCount = 0;

  @observable wordsData: AddWordResponse[] = [];

  @observable isLoadingLessons: 'true' | 'false' | 'pending' = 'pending';
  @observable isLoadingPublicLessons: 'true' | 'false' | 'pending' = 'pending';
  @observable isLoadingFavoriteLessons: 'true' | 'false' | 'pending' = 'pending';

  @observable createLessonModal = false;
  @observable deleteLessonModal = false;
  @observable showVideoActivityScreen = false;
  @observable variantBox: 'word' | 'activity' = 'word';
  @observable currentLesson: CurrentLesson | null = null;
  @observable newLesson = 0;
  @observable newLessonId: number;
  @observable newLessonInfo: IAddWord[] = [];
  @observable addedWordsCount = 0;
  @observable deleteLessonData: deleteLessonData = null;
  @observable scrollToGames = false;
  @observable gameArray: string[] = [];
  @observable countLetterWord: number;
  @observable lessonGames;
  @observable allLessonActivities;
  @observable lessonIdForLessonAssign: number;
  @observable procentToClassActivity = 0;

  constructor() {
    autoBind(this);
    makeAutoObservable(this);
  }

  @action getLessonDataLite(lessonId: number) {
    api.getLessonById(lessonId).then(({ data }) => {
      this.setLesson(data);
    });
  }

  @action
  setCheckAnswerTrueFalse(answer: { answer: boolean; id: number | string }) {
    this.statisticLessonData = this.statisticLessonData.map((item) => {
      return item.id === answer.id
        ? {
            ...item,
            userAnswer: answer.answer,
          }
        : item;
    });
    this.checkAnswer = {
      ...this.checkAnswer,
      trueFalseAnswer: [...this.checkAnswer.trueFalseAnswer, answer],
    };
  }

  @action setVariantBox(value: 'word' | 'activity') {
    this.variantBox = value;
  }

  @action setProcentToClassActivity(value: number, timeCode: number) {
    this.statisticArrayProcent.includes(this.videoGameData.find((f) => f.timeCode === timeCode))
      ? null
      : (this.procentToClassActivity = this.procentToClassActivity + value);
    this.procentToClassActivity > 100 ? (this.procentToClassActivity = 100) : null;
    this.statisticArrayProcent.push(this.videoGameData.find((f) => f.timeCode === timeCode));
  }

  @action resetProcentToClassActivity() {
    this.procentToClassActivity = 0;
    this.statisticArrayProcent = [];
  }

  @action deleteTrueFalseAnswer(id: number | string) {
    this.checkAnswer.trueFalseAnswer = this.checkAnswer.trueFalseAnswer.filter(
      (filteredItem) => filteredItem.id !== id
    );
  }

  @action resetCheckAnswer() {
    this.checkAnswer = { trueFalseAnswer: [], chooseOptionAnswer: [] };
  }

  @action setCheckMultipleChoose(answer: string, elementId: string | number) {
    this.statisticLessonData = this.statisticLessonData.map((item) => {
      return item.id === elementId
        ? {
            ...item,
            userAnswer:
              item.userAnswer === null
                ? [answer]
                : (item.userAnswer as string[]).some((s) => s === answer)
                ? [answer]
                : [...(item.userAnswer as string[]), answer],
          }
        : item;
    });
    this.checkAnswer = {
      ...this.checkAnswer,
      chooseOptionAnswer: [...this.checkAnswer.chooseOptionAnswer, answer],
    };
  }

  @action deleteCheckMultipleChoose(answer: string, elementId: string | number) {
    this.statisticLessonData = this.statisticLessonData.map((item) => {
      return item.id === elementId
        ? {
            ...item,
            userAnswer: (item.userAnswer as string[]).filter((f) => f !== answer),
          }
        : item;
    });
    this.checkAnswer = {
      ...this.checkAnswer,
      chooseOptionAnswer: [...this.checkAnswer.chooseOptionAnswer.filter((f) => f !== answer)],
    };
  }

  @action returnVideoGameData(timeCode: number, gameType: VideoGameType) {
    return this.lessonData?.videoGame
      ?.slice()
      .sort((a, b) => a.gameType.localeCompare(b.gameType))
      .filter((f) => f.timeCode === timeCode && f.gameType === gameType);
  }

  @computed setPaginationCount() {
    this.paginationCount = Math.ceil(this.lessonsPublic.totalResults / PAGE_SIZE);
  }

  @action async getLessonDataPublic(sortTypes?: LessonSortDataType, isLoading?: boolean) {
    !isLoading ? (this.isLoadingPublicLessons = 'true') : (this.isLoadingPublicLessons = 'false');
    try {
      const resp = await api.getPublicLessons(sortTypes);
      this.lessonsPublic = resp.data;
      this.setPaginationCount();
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoadingPublicLessons = 'false';
    }
  }

  @action getLessonDataPublicFromString(sortTypes: string) {
    this.isLoadingPublicLessons = 'true';

    api
      .getPublicLessonsFromString(sortTypes)
      .then(({ data }) => {
        this.lessonsPublic = data;
        this.setPaginationCount();
      })
      .catch((err) => console.error(err))
      .finally(() => (this.isLoadingPublicLessons = 'false'));
  }

  @action
  async getLessonData(lessonId: number, push?: (url: string) => void) {
    this.isLoadingLessons = 'true';
    api
      .getLessonById(lessonId)
      .then(({ data }) => {
        if (!data.id) {
          push('/404');
        }
        this.setLesson(data);
        this.setArrayGame();
        this.setWords(data.word as AddWordResponse[]);
        this.setLessonGames();
        this.videoGameData = data.videoGame;
      })
      .catch((err) => {
        push('/404');
        console.error(err);
      })
      .finally(() => (this.isLoadingLessons = 'false'));
  }
  @action
  async getTeacherLessonData(lessonId: number, classId: number, push?: (url: string) => void) {
    this.isLoadingLessons = 'true';
    try {
      const teacherLessonDataRes = await api.getTeacherLessonData(lessonId, classId);
      if (!teacherLessonDataRes) {
        push(`/teacher-classes/${classId}`);
      }
      const mappedData = {
        ...teacherLessonDataRes.data.lesson.lesson,
        statistic: teacherLessonDataRes.data.statistic,
        classId: teacherLessonDataRes.data.lesson.classId,
        teacherLessonId: teacherLessonDataRes.data.lesson.id,
        teacherId: teacherLessonDataRes.data.teacherId,
        teacherClassName: teacherLessonDataRes.data.teacherClassName,
      };

      this.setLesson(mappedData);
      this.setArrayGame();
      this.setLessonGames();
      this.setWords(mappedData.word as AddWordResponse[]);
      this.videoGameData = mappedData.videoGame;
    } catch (error) {
      push(`/teacher-classes/${classId}`);
      console.log(error);
    } finally {
      lessonStore.isLoadingLessons = 'false';
    }
  }

  @action
  async deleteWord(wordId: number) {
    const deleteResp = await api.delete(wordId);
    await this.updateLessons();
    if (this.addedWordsCount > 0) {
      this.addedWordsCount--;
    }
    this.getLessonDataLite(this.currentLessonOnLessons.id);
    return deleteResp;
  }

  @action setUpdateMode() {
    openEndedGameStore.gameData = this.lessonData.videoGame;
  }

  @action writeDeleteLessonData(lessonId: number, isShared: boolean, isFavorite: boolean) {
    this.deleteLessonData = { lessonId, isShared, isFavorite };
  }

  @action setVideoGameData() {
    this.videoGameData = openEndedGameStore.gameData;
  }

  @action sortVideoGameDataLesson() {
    this.sortVideoGameData = this.lessonData.videoGame?.sort((a, b) => a.timeCode - b.timeCode);
  }

  @action setOpenVideoActivityScreen(open: boolean) {
    this.showVideoActivityScreen = open;
    open === true ? videoStore.setHotkeysAvailable(false) : videoStore.setHotkeysAvailable(true);
  }

  @action setVideoInteractiveName(name: VideoGameType) {
    this.videoInteractiveName = name;
  }

  @action changeLessonDataWord(wordId: number, word: string) {
    this.lessonData.word = this.lessonData.word.map((item) => {
      if (item.id === wordId) {
        return {
          ...item,
          word: word,
        };
      } else return item;
    });
  }

  @action changeLessonDataTranslate(wordId: number, translate: string) {
    this.lessonData.word = this.lessonData.word.map((item) => {
      if (item.id === wordId) {
        return {
          ...item,
          translate: translate,
        };
      } else return item;
    });
  }

  @action
  async deleteLessonCard(lessonId: number, isShared: boolean, isFavorite: boolean) {
    if (isShared) {
      await api.deleteSharedLesson(lessonId);
    }
    if (isFavorite) {
      await api.deleteFavoriteLesson(lessonId);
    }
    if (!isShared && !isFavorite) {
      await api.deleteLessonId(lessonId);
    }
    this.deleteLessonData = null;
  }

  @action
  async deleteVideoLesson(lessonId: number) {
    const deleteResp = await api.deleteVideoLesson(lessonId);
    await this.updateLessons();
    return deleteResp;
  }

  @action reset() {
    this.lessons = [];
  }

  @action resetLessonData() {
    this.lessonData = null;
    this.resetSentenseWithWordData();
    this.resetVideoActivityData();
    this.resetProcentToClassActivity();
    localStorage.removeItem('newLessonLocal');
    localStorage.removeItem('newCoverLesson');
  }

  @action resetSentenseWithWordData() {
    this.sentenseWithWordData = [];
  }

  @action resetVideoActivityData() {
    this.videoGameData = [];
  }

  @action setSentenseWithWordData(data: IAddWord[]) {
    this.sentenseWithWordData = data;
  }

  @action deleteByTimeCode(id: string | number, timeCode: number) {
    this.videoGameData = this.videoGameData.filter((element) => element.id !== id);
    openEndedGameStore.decrementCounterActivity(timeCode);
    openEndedGameStore.deleteQuestion(id);
    this.saveNewLessonToLocal();
  }

  @action deleteByGameType(gameType: VideoGameType, timeCode: number) {
    const array = openEndedGameStore.allTimecode.filter((el) => {
      if (el.timeCode === timeCode) {
        return el.gameType !== gameType;
      } else return true;
    });
    openEndedGameStore.deleteItemTimeCode(array);
    this.videoGameData = this.videoGameData.filter((element) => {
      if (element.timeCode === timeCode) {
        return element.gameType !== gameType;
      } else return true;
    });
    openEndedGameStore.decrementCounterActivity(timeCode);
    openEndedGameStore.deleteByGameType(gameType, timeCode);
    this.saveNewLessonToLocal();
  }

  @action setSentenseWithWordEditLesson() {
    const data = this.lessonData.sentences
      .map((el) => {
        const sentence = {
          id: el.id,
          text: el.text,
          words: el.words,
          videoTimestamp: el.videoTimestamp,
          videoTimestampEnd: el.videoTimestampEnd,
        };

        return el.wordsNew.map((word) => {
          return {
            sentence,
            word,
          };
        });
      })
      .flat();

    this.sentenseWithWordData = data;
    this.saveNewLessonToLocal();
  }

  @action resetLessonDataAndSentenseWithWordData() {
    this.resetLessonData();
    this.resetSentenseWithWordData();
    this.resetVideoActivityData();
    openEndedGameStore.resetData();
  }

  @action setCreateLessonModal(value: boolean) {
    this.createLessonModal = value;
  }

  @action setDeleteLessonModal(value: boolean) {
    this.deleteLessonModal = value;
  }

  @computed get currentLessonOnLessons() {
    return (
      this.lessonData &&
      this.lessons.find((lesson) => {
        return lesson.id == this.lessonData.id;
      })
    );
  }

  @action getWordsFromText(text: string) {
    if (!this.currentLessonOnLessons) return [];
    for (const sentence of this.currentLessonOnLessons.sentences) {
      const indexOfText = sentence.text.indexOf(text);
      if (indexOfText !== -1) {
        return sentence.wordsNew
          .map((word) => {
            const index = word.index - indexOfText;
            if (index >= 0 && index < text.length) {
              return {
                ...word,
                index,
              };
            }
          })
          .filter((e) => e);
      }
    }
    return [];
  }

  @action
  async setLessonInfo(info: IAddWord) {
    this.newLessonInfo = [...this.newLessonInfo, info];
  }

  @action
  setnewLessonId(id: number) {
    this.newLessonId = id;
  }

  @action
  addNewWordToLocalStore(newWord: IAddWord) {
    this.sentenseWithWordData = [...this.sentenseWithWordData, newWord];
  }

  @action
  async createFullLesson(coverFile?: File) {
    openEndedGameStore.gameData.forEach((m) => delete m.id);
    this.lessonData.wordsCount = 0;

    const newLesson = await api.addFullLesson(
      {
        lesson: this.lessonData,
        sentenceAndWords: this.sentenseWithWordData,
        videoGame: openEndedGameStore.gameData,
      },
      coverFile
    );

    this.setnewLessonId(newLesson.data.lessonData.id);

    return newLesson.data.lessonData;
  }

  @action
  async copyFullLesson() {
    const copyLesson = {
      ...this.lessonData,
      id: null,
      userId: userStore.user.id,
      user: {
        avatarUrl: userStore.user.avatar,
        name: userStore.user.name,
      },
    };
    const sentenceAndWordsCopy = this.lessonData.sentences.map((s) => {
      return s.wordsNew.map((w) => {
        return {
          sentence: {
            text: s.text,
            videoTimestamp: s.videoTimestamp,
            videoTimestampEnd: s.videoTimestampEnd,
          },
          word: {
            index: w.index,
            length: w.length,
            translate: w.translate,
            word: w.word,
          },
        };
      });
    });
    const newLesson = await api.addFullLesson({
      lesson: copyLesson,
      sentenceAndWords: sentenceAndWordsCopy.flat(),
      videoGame: this.lessonData.videoGame.map((g) => {
        return {
          id: null,
          answer: g.answer,
          gameType: g.gameType,
          question: g.question,
          timeCode: g.timeCode,
        };
      }),
    });
    return newLesson.data.lessonData;
  }

  @action
  saveNewLessonToLocal() {
    const lessonData = {
      lesson: this.lessonData,
      sentenceWithWords: this.sentenseWithWordData,
      videoGame: this.videoGameData,
    };
    localStorage.setItem('newLessonLocal', JSON.stringify(lessonData));
  }

  @action
  addWord(info: IAddWord) {
    const wordData: AddWordResponse = { ...info.word, id: uuidv4() };
    info = { ...info, word: wordData };
    let newLesson: AddLessonResponse;

    if (this.lessonData && this.lessonData.word) {
      newLesson = { ...this.lessonData, word: [...this.lessonData.word, wordData] };
    } else {
      newLesson = { ...this.lessonData, word: [wordData] };
    }
    this.setLesson(newLesson);
    this.addNewWordToLocalStore(info);
    this.saveNewLessonToLocal();
    this.lessonData.wordsCount = this.lessonData.word.length;

    return wordData;
  }

  @action
  async addFavoriteLesson(lessonId: number) {
    this.isLoadingFavoriteLessons = 'true';
    this.lessonData.favoriteLessons.length === 0
      ? (await api.postFavoriteLesson({ lessonId: lessonId }).then((res) => {
          this.setLesson({
            ...this.lessonData,
            favoriteLessons: [{ id: res.data.data.id, lessonId: res.data.data.lessonId }],
          });
        }),
        (this.isLoadingFavoriteLessons = 'false'))
      : (await api.deleteFavoriteLesson(this.lessonData.favoriteLessons[0].id).then(() => {
          this.setLesson({ ...this.lessonData, favoriteLessons: [] });
        }),
        (this.isLoadingFavoriteLessons = 'false'));
  }

  @action setCurrentLesson(info: CurrentLesson) {
    this.currentLesson = info;
  }

  @action
  async updateLessonName(name: string) {
    await api.updateLessonName({ name: name }, this.lessonData.id);
    await this.getLessonDataLite(this.lessonData.id);
  }

  @action
  async updateLessonData() {
    await api.updateLesson(this.lessonData, this.lessonData.id);
  }

  @action
  async updateFullLesson(coverFile?: File) {
    openEndedGameStore.gameData.forEach((m) => delete m.id);
    await api.putFullLesson(
      {
        lesson: this.lessonData,
        sentenceAndWords: this.sentenseWithWordData,
        videoGame: this.videoGameData,
      },
      coverFile
    );
  }

  @action
  async updateLessonCoverAndLevel(level: SortByEnglishLevelType, picture: string) {
    await api.updateLesson(
      { ...this.lessonData, level: level, picture: picture },
      this.lessonData.id
    );
  }

  @action
  async updateWord(translate: string, word: string, wordId: number) {
    await api.updateWord({ translate: translate, word: word }, wordId);
    await this.getLessonDataLite(this.lessonData.id);
  }

  @action
  async updateLessonLevel(level: SortByEnglishLevelType) {
    await api.updateLesson({ ...this.lessonData, level: level }, this.lessonData.id);
    await this.getLessonDataLite(this.lessonData.id);
  }

  @action
  async updateLessonWordAndLevel(level: SortByEnglishLevelType) {
    await api.updateLessonWithWordsNew(this.lessonData.id, this.lessonData.word);
    await api.updateLesson({ ...this.lessonData, level: level }, this.lessonData.id);
    await this.getLessonDataLite(this.lessonData.id);
  }

  @action resetCurrentLesson() {
    this.currentLesson = null;
  }

  @action resetNewLesson() {
    this.newLesson = 0;
  }

  @action
  async updateLessons(lessonPage?: boolean) {
    !lessonPage && (this.isLoadingLessons = 'true');
    try {
      const resp = await api.getWords();
      const respShared = await api.getSharedLessons();
      const respFavorite = await api.getFavoriteLessons();
      this.lessons = resp.data;
      this.sharedLessons = respShared.data;
      this.favoriteLessons = respFavorite.data;
      sortStore.setLessonsSorted('date:desc', this.lessons);
      sortStore.setLessonsSorted('date:desc', this.sharedLessons);
      sortStore.setLessonsSorted('date:desc', this.favoriteLessons);

      videoStore.foundVideos = null;
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoadingLessons = 'false';
    }
  }

  @action setWords(data: AddWordResponse[]) {
    this.wordsData = data;
  }

  @action setLesson(data: AddLessonResponse) {
    this.lessonData = data;
    this.statisticLessonData = [];
    data.videoGame?.forEach((element) => {
      element.gameType === 'true_or_false' &&
        (this.statisticLessonData.some((el) => el.id !== element.id) ||
          this.statisticLessonData.length === 0) &&
        this.statisticLessonData.push({
          timeCode: element.timeCode,
          id: element.id,
          gameType: element.gameType,
          correctAnswer: element.answer?.correct,
          userAnswer: null,
        });
      element.gameType === 'multiple_choice' &&
        (this.statisticLessonData.some((el) => el.id !== element.id) ||
          this.statisticLessonData.length === 0) &&
        this.statisticLessonData.push({
          timeCode: element.timeCode,
          id: element.id,
          gameType: element.gameType,
          correctAnswer: element.answer?.correct,
          userAnswer: null,
        });
    });
  }

  @action getStatisticForVideoActivity(timeCode: number) {
    const arrayOfNumbers = [];

    const statisticArray = this.statisticLessonData.filter((f) => f.timeCode === timeCode);
    statisticArray.forEach((fe) => {
      const pushStatistic = (value: 0 | 100) => {
        arrayOfNumbers.push(value);
        this.statisticLessonData = this.statisticLessonData.map((m) => {
          return fe.id === m.id ? { ...m, statisticArray: value } : m;
        });
      };
      if (
        Array.isArray(fe.correctAnswer) &&
        fe.correctAnswer.length === (fe.userAnswer as string[])?.length
      ) {
        fe.correctAnswer.every((value, index) => value === fe.userAnswer[index])
          ? pushStatistic(100)
          : pushStatistic(0);
      } else if (typeof fe.correctAnswer === 'boolean') {
        fe.correctAnswer === fe.userAnswer ? pushStatistic(100) : pushStatistic(0);
      } else return pushStatistic(0);
    });
    arrayOfNumbers.length > 0 &&
      (this.timeCodeStatisticPercent =
        arrayOfNumbers.reduce((add, acc) => add + acc, 0) / arrayOfNumbers.length);
  }

  @action clearLessonId() {
    setTimeout(() => {
      this.newLessonId = null;
    }, 2000);
  }

  @action resetTimeCodeStatisticPercent() {
    this.statisticLessonData = this.statisticLessonData.map((f) => {
      if (f.userAnswer !== null) {
        return { ...f, userAnswer: null };
      }
      return f;
    });
  }

  @action setScrollToGames(scroll: boolean) {
    this.scrollToGames = scroll;
  }

  @action setCover(coverEdit: string) {
    this.setLesson({
      ...this.lessonData,
      picture: coverEdit,
    });
    this.saveNewLessonToLocal();
  }

  @action addNewWord() {
    const wordPairId: WordPair = {
      id: uuidv4(),
      word: '',
      translate: '',
    };
    const newWords = [...this.lessonData.word, wordPairId];

    this.setLesson({ ...this.lessonData, word: newWords });
    this.lessonData.wordsCount = this.lessonData.word.length;

    this.saveNewLessonToLocal();
  }

  @action setLessonName(name: string) {
    this.setLesson({ ...this.lessonData, name });
    this.saveNewLessonToLocal();
  }

  @action setWord(id: number, newWord: string) {
    const word = this.lessonData.word.map((item: AddWordResponse) => {
      if (item.id === id) {
        item.word = newWord;
      }

      return item;
    });
    this.setTranslationInSentanceLocal(id, { word: newWord });

    this.setLesson({ ...this.lessonData, word });
    this.saveNewLessonToLocal();
  }

  @action
  setTranslationInSentanceLocal(id: number, changes: { translate?: string; word?: string }) {
    this.sentenseWithWordData.forEach((el, index) => {
      if (el.word.id === id) {
        this.sentenseWithWordData[index] = {
          ...this.sentenseWithWordData[index],
          word: {
            ...this.sentenseWithWordData[index].word,
            ...changes,
          },
        };
      }
    });
  }

  @action
  setTranslation(id: number, translate: string) {
    const newTranslation = this.lessonData.word.map((item: AddWordResponse) => {
      if (item.id === id) {
        item.translate = translate;
      }
      return item;
    });

    this.setTranslationInSentanceLocal(id, { translate });
    this.setLesson({ ...this.lessonData, word: newTranslation });
    this.saveNewLessonToLocal();
  }

  @action
  setTranslationHint(hint: string) {
    const { id } = hintTranslationStore.translateWord;

    const newTranslation = this.lessonData.word.map((item: AddWordResponse) => {
      if (item.id === id) {
        item.translate = hint;
      }

      return item;
    });

    this.setTranslationInSentanceLocal(id, { translate: hint });
    this.setLesson({ ...this.lessonData, word: newTranslation });
    this.saveNewLessonToLocal();
  }

  @action
  deleteWordLocal(id: number) {
    const removedArr = this.lessonData.word.filter((item) => item.id !== id);
    const removedWordArr = this.sentenseWithWordData.filter((item) => item.word.id !== id);
    this.setLesson({ ...this.lessonData, word: removedArr });
    this.setSentenseWithWordData(removedWordArr);
    this.lessonData.wordsCount = this.lessonData.word.length;
    this.saveNewLessonToLocal();
  }

  @action
  setEnglishLevel(level: SortByEnglishLevelType) {
    this.setLesson({
      ...this.lessonData,
      level,
    });
    this.saveNewLessonToLocal();
  }

  @action
  setMediaUrl(idVideo: string) {
    this.setLesson({
      ...this.lessonData,
      mediaUrl: `https://www.youtube.com/watch?v=${idVideo}`,
    });
    this.saveNewLessonToLocal();
    localStorage.setItem('videoId', idVideo);
  }

  @action
  setArrayGame() {
    if (lessonStore.lessonData?.game) {
      this.gameArray = lessonStore.lessonData.game.map((el) => el.gameType.split('_')[0]);
    }
  }

  @action
  async setLessonRating(rating: number) {
    await api.postLessonRating({ rating: rating, lessonId: this.lessonData.id });
    this.getLessonDataLite(this.lessonData.id);
  }

  @action
  setIsPrivateLesson(isPrivate: boolean) {
    this.setLesson({
      ...this.lessonData,
      private: isPrivate,
    });
    this.saveNewLessonToLocal();
  }

  @action private setCountLetterWord(data) {
    this.countLetterWord = data;
  }

  @action setLessonGames() {
    let countLetterWord = 0;
    if (this.lessonData && this.lessonData.word) {
      this.lessonData.word.forEach((item) => {
        if (item.word.length <= 19) countLetterWord += item.word.length;
      });
      countLetterWord != 0 ? this.setCountLetterWord(countLetterWord) : this.setCountLetterWord(1);
    }

    const games = this.lessonData.mediaUrl
      ? gameBlock.filter((game) => {
          return countLetterWord > game.countLetterWord && !game.copy;
        })
      : gameBlock.filter((game) => {
          return !game.withVideo && countLetterWord > game.countLetterWord;
        });
    this.lessonGames = games;

    const activeLessonGames = {};
    games.forEach((game) => {
      activeLessonGames[game.name] = 0;
    });
    if (this.lessonData.mediaUrl) {
      this.allLessonActivities = {
        ...activeLessonGames,
        videoGame: this.lessonData.videoGame.length > 0 ? 0 : null,
      };
    } else {
      this.allLessonActivities = activeLessonGames;
    }
  }
}
