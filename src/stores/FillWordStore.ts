import autoBind from 'auto-bind';
import { action, makeObservable, observable } from 'mobx';

import { WordPair } from '~/types/api';
import { ChooseGamePages, FillwordData, GlobalWord, WordData } from '~/types/game';

enum Path {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}

export default class FillWordStore {
  @observable loadData = false;
  @observable isFieldBlocked = false;
  @observable returnBack = false;
  @observable isOpenedModal = '';
  @observable combinationDomList = [];
  @observable validColors: string[] = [];
  @observable translateWord: number[] = [];
  @observable wordsDataStorage: any[] | undefined = [];
  @observable wordsPair: WordPair[] | undefined = [];
  @observable globalWord: GlobalWord = { selectWords: {} };
  @observable fillWordDataStorage: FillwordData | null = null;
  @observable page: ChooseGamePages = 'game';
  @observable prewPage: ChooseGamePages = 'game';
  @observable round = 1;
  @observable countRound = 0;
  @observable countWordReadyGame = 0;
  @observable currentCountAnswer = 0;
  @observable value = 0;
  @observable hintWordId = 0;
  @observable wordsCount = 0;

  arrayColor: string[] = [
    '#DB6502',
    '#BF44F3',
    '#EBDB4A',
    '#00C4F3',
    '#0E9595',
    '#F5993D',
    '#FF8D2D',
    '#4D95E4',
    '#FB637A',
    '#35D5CB',
    '#6B85FF',
    '#FF8D69',
    '#CE93FC',
    '#FFCF26',
    '#FD94C6',
    '#8C8ACE',
    '#77E382',
  ];

  constructor() {
    autoBind(this);
    makeObservable(this);
  }

  @action setCombinationDomList(list: Array<HTMLElement>) {
    this.combinationDomList = [...this.combinationDomList, ...list];
  }

  @action setLoadData(eql: boolean) {
    this.loadData = eql;
  }

  @action setIsOpenedModal(str: string) {
    this.isOpenedModal = str;
  }

  @action addTranslateWord(number: number) {
    this.translateWord.push(number);
  }

  @action setValidColors() {
    this.validColors = this.arrayColor;
  }

  @action setPage(page: ChooseGamePages) {
    this.prewPage = this.page;
    this.page = page;
  }

  @action setCountRound(count: number) {
    this.countRound = count;
  }

  @action setRound(number: number) {
    this.round = number;
  }

  @action setCountWordReadyGame() {
    ++this.countWordReadyGame;
  }

  @action resetWord() {
    this.round = 1;
    this.loadData = false;
    this.fillWordDataStorage = null;
    for (const el in this.globalWord.selectWords) {
      this.globalWord.selectWords[el].length = 0;
    }
    this.translateWord = [];
    this.combinationDomList = [];
    this.wordsPair.length = 0;
    this.wordsDataStorage = [];
    this.countRound = 0;
    this.countWordReadyGame = 0;
    this.wordsCount = 0;
    this.currentCountAnswer = 0;
    this.value = 0;
  }

  @action resetTranslatedWord() {
    this.translateWord = [];
  }

  @action resetCountReadyWords() {
    this.countWordReadyGame = 0;
  }

  @action setWordsPair(wordsPair: WordPair[]) {
    this.wordsPair = wordsPair;
  }

  @action pushWordsPair(wordsPair: WordPair) {
    this.wordsPair.push(wordsPair);
  }

  @action setCurrentCountAnswer(count: number) {
    this.currentCountAnswer = count;
  }

  @action valueChange() {
    ++this.value;
    this.wordsCount = 0;
    this.currentCountAnswer = 0;
  }

  @action setHintWordId(number: number) {
    this.hintWordId = number;
  }

  @action setWordsCount() {
    ++this.wordsCount;
  }

  @action setWordsDataStorage(arr: WordPair[]) {
    this.wordsDataStorage = arr;
  }

  @action addWords(items: WordPair[]) {
    items.forEach((item: { word: string; id: number; translate: string }) => {
      const wordLength = item.word.length;
      if (wordLength >= 20) {
        return;
      }
      if (!this.globalWord.selectWords[wordLength]) {
        this.globalWord.selectWords[wordLength] = [];
      }
      if (!this.isIncludeWord(this.globalWord.selectWords[wordLength], item.word)) {
        const wordToAdd: WordData = {
          id: item.id,
          word: item.word,
          level: 0,
          translate: item.translate,
          connection: [],
          prompt: [],
        };
        this.globalWord.selectWords[wordLength].push(wordToAdd);
      }
    });
  }

  @action isIncludeWord(arr: WordPair[], word: string) {
    for (const el of arr) {
      if (el.word === word) {
        return true;
      }
    }
    return false;
  }

  @action getRandomField(size: number): FillwordData {
    const letterLength = Math.pow(size, 2);
    const words: WordData[] = this.getWords(letterLength);
    if (!words) {
      return;
    }
    return this.fillField(size, words);
  }

  @action getWords(fieldLength: number): WordData[] {
    let wordsList: WordData[] = [];
    let countWord = 0;

    for (const el in this.globalWord.selectWords) {
      if (el) {
        wordsList.push(...this.globalWord.selectWords[el]);
        for (const count in this.globalWord.selectWords[el]) {
          countWord += this.globalWord.selectWords[el][count].word.length;
        }
      }
    }
    if (this.round === 1) {
      this.countRound = Math.floor(countWord / 25);
      if (!Number.isInteger(countWord / 25)) {
        ++this.countRound;
      }
    }
    if (countWord <= 24) {
      setTimeout(() => {
        this.returnBack = true;
      }, 1500);
      return;
    }
    const wordsStr = [];
    const words = [];
    let iter = 0;
    const COUNTITER = 20;

    while (wordsStr.join('').length !== fieldLength) {
      const min = 0;
      const max = wordsList.length;
      const index = Math.floor(Math.random() * (max - min)) + min;
      const word = wordsList[index]?.word;
      const wordLengthTmp = wordsStr.join('') + word;

      if (wordLengthTmp.length < fieldLength - 3) {
        wordsStr.push(word);
        words.push(wordsList[index]);
        wordsList = wordsList.filter((e) => e.word !== word);
      } else if (
        (wordLengthTmp.length > fieldLength - 3 && wordLengthTmp.length < fieldLength) ||
        wordLengthTmp.length > fieldLength
      ) {
        iter++;
        if (iter === COUNTITER) {
          break;
        }
        continue;
      } else if (wordLengthTmp.length === fieldLength) {
        wordsStr.push(word);
        words.push(wordsList[index]);
        break;
      }
    }
    this.setWordsDataStorage(words);
    return words;
  }

  @action fillField(size: number, words: WordData[]): FillwordData {
    const letterLength = Math.pow(size, 2);
    const field = new Array(size).fill(null).map(() => new Array(size).fill(false));
    const fieldSteps = [];

    for (let i = 0, cell: any[]; i < letterLength; i++) {
      cell = this.getRandomCell(size, field);

      if (this.fillCell(cell[0], cell[1], field, fieldSteps)) {
        break;
      }
    }
    return this.createLevel(field, fieldSteps, words);
  }

  @action getRandomCell(size: number, arr: any) {
    for (;;) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);

      if (arr[x][y] === false) {
        arr[x][y] = true;
        return [x, y];
      }
    }
  }

  @action fillCell(row: any, col: any, field: any, result: any, char = 0): boolean {
    if (!this.contains(field)) {
      return true;
    }

    field[row][col] = char;
    result.push([row, col]);

    const arr = new Array(4).fill(false);
    for (let i = 0, nextCell: number; i < 4; i++) {
      nextCell = this.getRandomValue(arr);
      switch (nextCell) {
        case Path.TOP:
          if (this.checkBorder(field, row - 1, col) && !this.checkLetter(field, row - 1, col)) {
            this.fillCell(row - 1, col, field, result, char + 1);
          }
          break;
        case Path.RIGHT:
          if (this.checkBorder(field, row, col + 1) && !this.checkLetter(field, row, col + 1)) {
            this.fillCell(row, col + 1, field, result, char + 1);
          }
          break;
        case Path.BOTTOM:
          if (this.checkBorder(field, row + 1, col) && !this.checkLetter(field, row + 1, col)) {
            this.fillCell(row + 1, col, field, result, char + 1);
          }
          break;
        case Path.LEFT:
          if (this.checkBorder(field, row, col - 1) && !this.checkLetter(field, row, col - 1)) {
            this.fillCell(row, col - 1, field, result, char + 1);
          }
          break;
      }
    }

    if (!this.contains(field)) {
      return true;
    }

    field[row][col] = false;
    result.length -= 1;
    return false;
  }

  @action contains(field: boolean[][] | string[][]): boolean {
    const fieldLength = field.length;
    for (let i = 0; i < fieldLength; i++) {
      for (let j = 0; j < fieldLength; j++) {
        if (field[i][j] === false) {
          return true;
        }
      }
    }
    return false;
  }

  @action getRandomValue(arr: any) {
    for (;;) {
      const val = Math.floor(Math.random() * arr.length);
      if (arr[val] === false) {
        arr[val] = true;
        return val;
      }
    }
  }

  @action checkBorder(arr: any, row: any, col: any): boolean {
    const arrLength = arr.length;
    return !(row < 0 || row === arrLength || col < 0 || col === arrLength);
  }

  @action checkLetter(arr: any, row: any, col: any): boolean {
    return arr[row][col] != false;
  }

  @action createLevel(
    field: any[][],
    fieldSteps: [number, number][],
    words: WordData[]
  ): FillwordData {
    try {
      fieldSteps.shift();

      words.forEach((word) => {
        word.connection = [];
        word.prompt = [];
        for (const char of word.word) {
          const [y, x] = fieldSteps.pop();
          word.connection.push([y, x]);
          if (char === ' ') {
            field[y][x] = '_';
          } else {
            field[y][x] = char;
          }
        }
      });

      return {
        id: 0,
        themeId: null,
        level: null,
        levelInTheme: null,
        words,
        board: field,
      };
    } catch (error) {
      console.error(error);
    }
  }

  @action setFillWordDataStorage(data: FillwordData) {
    this.fillWordDataStorage = data;
  }

  @action resetCells(domArray: any[]) {
    domArray.forEach(
      (e: {
        dataset: { state: string; hint: string };
        children: {
          length: number;
          item: (arg0: number) => { (): any; new (): any; remove: { (): void; new (): any } };
        };
        style: { background: string };
      }) => {
        e.dataset.state = '';
        if (e.children.length !== 0 && e.dataset.hint !== 'hinted') {
          e.children.item(0).remove();
        }
        if (e.dataset.hint !== 'hinted') {
          e.style.background = '';
        }
      }
    );
  }
}
