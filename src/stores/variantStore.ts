import autoBind from 'auto-bind';
import { action, computed, makeObservable, observable } from 'mobx';

import { lessonStore } from '~/stores/index';
import { AddWordResponse } from '~/types/api';
import { ChooseGamePages } from '~/types/game';

export default class VariantStore {
  @observable currentIndexQuestion = 0;
  @observable page: ChooseGamePages = 'game';
  @observable prewPage: ChooseGamePages = 'game';
  @observable rounds = 0;
  @observable currentRound = 1;
  @observable wordsInCurrentRound = 0;
  @observable currentStepInRound = 0;
  @observable skipWord = 0;
  @observable translationsVariants: string[] = [];
  @observable clickIsAble = true;
  @observable wordsData: AddWordResponse[] = [];
  @observable lessonName = '';
  @observable titleSize: 'medium' | 'large';
  @observable variantSize: 'small' | 'medium' | 'large';

  titleLengthBreakpoints = {
    MEDIUM: 68,
    LARGE: 131,
  };

  variantLengthBreakpoints = {
    SMALL: 35,
    MEDIUM: 70,
    LARGE: 119,
  };

  constructor() {
    autoBind(this);
    makeObservable(this);
  }

  @action
  setClickIsAbles(isAble: boolean) {
    this.clickIsAble = isAble;
  }

  @action
  setTranslationsVariants(words: string[]) {
    this.translationsVariants = words;
  }

  @action
  setRounds(words: number) {
    this.rounds = Math.ceil(words / 12);
  }

  @action
  setWordsInCurrentRound(words: number) {
    this.wordsInCurrentRound = words;
  }

  @action
  setCurrentStepInRound(step: number) {
    this.currentStepInRound = step;
  }

  @action
  setCurrentRound(round) {
    this.currentRound = round;
  }

  @action nextQuestion() {
    ++this.currentIndexQuestion;
  }
  @action nextQuestionSkip() {
    ++this.currentIndexQuestion;
    ++this.skipWord;
  }

  @action resetQuestionCounter() {
    this.currentStepInRound = 0;
    this.currentIndexQuestion = 0;
    this.skipWord = 0;
  }

  @action setPage(page: ChooseGamePages) {
    this.prewPage = this.page;
    this.page = page;
  }

  @action resetDataChooseGame() {
    this.page = 'game';
  }

  @action
  setWordsData() {
    this.wordsData = lessonStore.wordsData;
    this.lessonName = lessonStore.lessonData.name;
    this.setRounds(lessonStore.wordsData.length);
    this.setCurrentRound(1);
    this.setPage('game');
    if (this.rounds === 1) {
      this.setWordsInCurrentRound(this.wordsData.length);
    } else {
      if (this.currentRound === this.rounds) {
        this.setWordsInCurrentRound(this.wordsData.length % 12);
      } else {
        this.setWordsInCurrentRound(12);
      }
    }

    this.titleSize = this.translationsVariants.some(
      (w) => w.length > this.titleLengthBreakpoints.MEDIUM
    )
      ? 'large'
      : 'medium';

    this.setVariantSize();
  }

  @action setVariantSize() {
    this.variantSize = this.translationsVariants.some(
      (w) => w.length > this.variantLengthBreakpoints.MEDIUM
    )
      ? 'large'
      : this.translationsVariants.some(
          (w) =>
            w.length > this.variantLengthBreakpoints.SMALL &&
            w.length <= this.variantLengthBreakpoints.MEDIUM
        )
      ? 'medium'
      : 'small';
  }
}
