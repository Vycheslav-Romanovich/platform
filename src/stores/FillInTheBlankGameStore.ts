import autoBind from 'auto-bind';
import { action, makeAutoObservable, observable } from 'mobx';

import { lessonStore, userStore } from '~/stores/index';
import { ChooseGamePages } from '~/types/game';

export interface Task {
  sentence: string;
  correctAnswer: string;
  variants: string[];
  videoStamps: number[];
  videoURL: string;
}

export class FillInTheBlanksGameStore {
  @observable page: ChooseGamePages = 'game';
  @observable prewPage: ChooseGamePages = 'game';
  @observable videoUrl = '';
  @observable wordsInCurrentRound = 0;
  @observable currentRound = 1;
  @observable rounds = 0;
  @observable tasks = [] as Task[];
  @observable currentIndex = 0;
  @observable lessonName = '';
  @observable countAnswer = 0;
  @observable correctChoices = [] as string[];
  @observable incorrectChoices = [] as string[];
  @observable trigger = false;
  @observable currentStepInRound = 0;
  @observable tasksForCurrentRound = [] as Task[];
  @observable alreadyLearned = [] as Task[];

  constructor() {
    autoBind(this);
    makeAutoObservable(this);
  }

  @action setPage(page: ChooseGamePages) {
    this.prewPage = this.page;
    this.page = page;
  }

  @action resetDataChooseGame() {
    this.page = 'game';
  }

  @action
  rebootAll() {
    this.currentIndex = 0;
    this.tasks = [];
    this.currentStepInRound = 0;
  }

  @action
  addCorrectChoice(word: string) {
    this.correctChoices.push(word);
    this.trigger = !this.trigger;
    ++this.countAnswer;
  }

  @action
  addIncorrectChoice(word: string) {
    this.incorrectChoices.push(word);
    this.trigger = !this.trigger;
  }

  @action
  resetChoices() {
    this.correctChoices = [];
    this.incorrectChoices = [];
  }

  @action
  nextWord() {
    ++this.currentIndex;
  }

  @action
  nextStep() {
    ++this.currentStepInRound;
  }

  @action
  skipWord() {
    --this.wordsInCurrentRound;
    ++this.currentIndex;
  }

  @action
  addToAlreadyLearned() {
    this.alreadyLearned.push(this.tasksForCurrentRound[this.currentIndex]);
  }

  @action
  addWordToShowAgain() {
    this.tasksForCurrentRound.push(this.tasksForCurrentRound[this.currentIndex]);
  }

  @action
  startAgain() {
    this.currentIndex = 0;
    this.currentStepInRound = 0;
    this.currentRound = 1;
    this.fetchTasks();
    this.setTasksForRound();
    this.countAnswer = 0;
  }

  @action
  nextRound() {
    ++this.currentRound;
    this.currentStepInRound = 0;
    this.currentIndex = 0;
  }

  @action
  fetchTasks() {
    const lessonData = lessonStore.lessonData;
    const sentences = lessonData?.sentences.map((s) => s);
    const allWords = sentences
      .map((sentence) => {
        return sentence.wordsNew.map((w) => w.word);
      })
      .flat(2);
    const tasks = sentences.map((sentence) => {
      return sentence.wordsNew.map((word) => {
        const variants = allWords.filter((w) => w !== word.word);
        variants.length = 2;
        variants.push(word.word);
        variants.sort(() => Math.round(Math.random() * 100) - 50);
        return {
          sentence: sentence.text,
          correctAnswer: word.word,
          variants,
          videoStamps: [sentence.videoTimestamp, sentence.videoTimestampEnd],
          videoURL: lessonData.mediaUrl,
        };
      });
    });
    this.tasks = tasks.flat(10);
    this.rounds = Math.ceil(this.tasks.length / 12);
    this.lessonName = lessonData?.name;
    this.videoUrl = lessonData?.mediaUrl;
    this.setPage('game');
    this.countAnswer = 0;
  }

  @action
  setTasksForRound() {
    this.tasksForCurrentRound = this.tasks.filter((task) => {
      return !this.alreadyLearned.includes(task);
    });
    if (this.tasksForCurrentRound.length > 12) {
      this.tasksForCurrentRound.length = 12;
    }
    this.wordsInCurrentRound = this.tasksForCurrentRound.length;
  }
}
