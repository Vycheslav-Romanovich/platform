import autoBind from 'auto-bind';
import { action, makeAutoObservable, observable } from 'mobx';

import { lessonStore } from '~/stores/index';

export interface WordsForGame {
  pairId: number;
  englishWord: string;
  russianTranslate: string;
}

export interface wordData {
  type: 'original' | 'translate';
  pairId: number;
  index: number;
  word: string;
}

export class MatchingPairsGameStore {
  @observable correctOrNot: 'correct' | 'incorrect' | 'pending' = 'pending';

  @observable step: 1 | 2 = 1;

  @observable words: WordsForGame[] = [];

  @observable selectedWords: wordData[] = [];

  @observable gameWasLoaded = false;

  @observable matchedWords: wordData[] = [];

  @observable shuffledArray: wordData[] = [];

  @observable correctChoices: wordData[] = [];

  @observable incorrectChoices: wordData[] = [];

  @observable mistakes: wordData[] = [];

  @observable roundTime = 0;

  @observable gameTime = 0;

  @observable clicks = true;

  @observable startAgainTrigger = false;

  @observable reshuffleWords = true;

  @observable rounds = 0;

  @observable currentRound = 0;

  @observable countAnswer = 0;

  @observable learnedWords: wordData[] = [];

  @observable lessonName = '';

  @observable size: 'xsmall' | 'small' | 'medium' | 'large';

  @observable desktopBlockPairsAmount: number;

  @observable mobileBlockPairsAmount: number;

  wordsLengthBreakpoints = {
    XSMALL: 15,
    SMALL: 40,
    MEDIUM: 68,
    LARGE: 131,
  };

  constructor() {
    autoBind(this);
    makeAutoObservable(this);
  }

  @action
  setSelectedFirstWord(word: wordData) {
    this.selectedWords.push(word);
    this.step = 2;
  }

  @action
  setSelectedSecondWord(word: wordData) {
    if (this.selectedWords.includes(word)) {
      this.step = 1;
      this.selectedWords = [];
      return;
    }
    this.selectedWords.push(word);
    this.compareSelectedWords();
    this.step = 1;
  }

  @action
  compareSelectedWords() {
    const possibleVariants = this.words
      .filter((w) => {
        return (
          w.englishWord === this.selectedWords[0].word ||
          w.russianTranslate === this.selectedWords[0].word
        );
      })
      .map((w) => {
        return w.englishWord === this.selectedWords[0].word ? w.russianTranslate : w.englishWord;
      });
    if (possibleVariants.includes(this.selectedWords[1].word)) {
      this.correctOrNot = 'correct';
      this.correctChoices.unshift(this.selectedWords[0]);
      this.correctChoices.unshift(this.selectedWords[1]);
    } else {
      this.correctOrNot = 'incorrect';
      this.incorrectChoices.push(this.selectedWords[0]);
      this.incorrectChoices.push(this.selectedWords[1]);
    }
    this.selectedWords = [];
    this.clicks = !this.clicks;
  }

  @action
  deleteMatchedWords() {
    if (this.correctOrNot === 'correct') {
      this.matchedWords.push(this.correctChoices[0], this.correctChoices[1]);
      this.learnedWords.push(this.correctChoices[0], this.correctChoices[1]);
      this.correctOrNot = 'pending';
    }
  }

  @action
  resetIncorrectChoices() {
    this.mistakes = [...this.mistakes, ...this.incorrectChoices];
    this.incorrectChoices = [];
  }

  @action
  rebootSettings() {
    this.shuffledArray = [];
    this.selectedWords = [];
    this.correctChoices = [];
    this.incorrectChoices = [];
    this.matchedWords = [];
    this.step = 1;
    this.correctOrNot = 'pending';
    this.mistakes = [];
    this.clicks = !this.clicks;
    this.reshuffleWords = !this.reshuffleWords;
    this.gameWasLoaded = false;
    if (this.currentRound === this.rounds - 1) {
      ++this.currentRound;
    } else {
      ++this.currentRound;
    }
    this.roundTime = 0.0;
    this.gameWasLoaded = true;
  }

  @action
  startAgain() {
    this.rebootSettings();
    this.gameTime = 0;
    this.countAnswer = 0;
    this.currentRound = 1;
    this.learnedWords = [];
    this.startAgainTrigger = !this.startAgainTrigger;
  }

  @action
  setRoundTime(minutes: number, seconds: number, milliseconds: number) {
    const newDate = new Date();
    newDate.setHours(0, minutes, seconds, milliseconds);

    if (this.shuffledArray.length === this.learnedWords.length) {
      this.roundTime =
        newDate.getMinutes() * 60 + newDate.getSeconds() + newDate.getMilliseconds() * 0.1;
    }
  }

  @action
  setGameTime(seconds: number, milliseconds: number) {
    if (+this.gameTime.toString().split('.')[1] + milliseconds * 0.1 < 10) {
      this.gameTime = this.gameTime + seconds + milliseconds * 0.1;
    } else {
      this.gameTime = this.gameTime + seconds + 1 + (milliseconds - 10) * 0.1;
    }
  }

  @action
  setCountAnswer(count: number) {
    this.countAnswer = this.countAnswer + count;
  }

  @action
  fetchWords(lessonId: number, pairsAmount: number) {
    this.words = lessonStore.wordsData.map((w, index) => {
      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
      return {
        pairId: index,
        englishWord: capitalizeFirstLetter(w.word),
        russianTranslate: capitalizeFirstLetter(w.translate),
      };
    });
    this.rounds = Math.ceil(this.words.length / pairsAmount);
    this.currentRound = 1;
    this.setWordsForGame(pairsAmount);
    this.lessonName = lessonStore.lessonData.name;
    this.gameWasLoaded = true;
  }

  @action
  shuffledRandomArray(array: wordData[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    this.shuffledArray = array;
  }

  @action
  setWordsForGame(pairsAmount: number) {
    this.rounds = Math.ceil(this.words.length / pairsAmount);
    const arr = this.words.sort(() => Math.round(Math.random() * 100) - 50);
    const englishWordsArray = arr
      .map((wordsPair) => {
        return {
          type: 'original',
          pairId: wordsPair.pairId,
          word: wordsPair.englishWord,
        };
      })
      .filter((w) => !this.learnedWords.map((w) => w.word).includes(w.word));
    if (englishWordsArray.length > pairsAmount) {
      englishWordsArray.length % pairsAmount === 1
        ? (englishWordsArray.length = pairsAmount - 1)
        : (englishWordsArray.length = pairsAmount);
    }
    const russianWordsArray = arr
      .map((wordsPair) => {
        return {
          type: 'translate',
          pairId: wordsPair.pairId,
          word: wordsPair.russianTranslate,
        };
      })
      .filter((w) => !this.learnedWords.map((w) => w.word).includes(w.word));
    if (russianWordsArray.length > pairsAmount) {
      russianWordsArray.length % pairsAmount === 1
        ? (russianWordsArray.length = pairsAmount - 1)
        : (russianWordsArray.length = pairsAmount);
    }
    this.shuffledArray = [].concat(englishWordsArray, russianWordsArray).map((word, index) => {
      return {
        type: word.type,
        pairId: word.pairId,
        index,
        word: word.word,
      };
    });
    this.size = this.shuffledArray.some((w) => w.word.length > this.wordsLengthBreakpoints.MEDIUM)
      ? 'large'
      : this.shuffledArray.some(
          (w) =>
            w.word.length >= this.wordsLengthBreakpoints.SMALL &&
            w.word.length < this.wordsLengthBreakpoints.MEDIUM
        )
      ? 'medium'
      : this.shuffledArray.some(
          (w) =>
            w.word.length > this.wordsLengthBreakpoints.XSMALL &&
            w.word.length < this.wordsLengthBreakpoints.SMALL
        )
      ? 'small'
      : 'xsmall';

    this.desktopBlockPairsAmount =
      this.size === 'small' ? 5 : this.size === 'medium' ? 4 : this.size === 'large' ? 3 : 8;
    this.mobileBlockPairsAmount =
      this.size === 'small' ? 4 : this.size === 'medium' ? 3 : this.size === 'large' ? 3 : 6;
    this.shuffledRandomArray(this.shuffledArray);
    this.learnedWords = [];
  }
}
