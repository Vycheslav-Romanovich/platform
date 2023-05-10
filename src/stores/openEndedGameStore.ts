import autoBind from 'auto-bind';
import { action, makeObservable, observable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

import { openEndedGameStore, videoStore } from '~/stores/index';
import { VideoGameAnswerType, VideoGameDto, VideoGameType } from '~/types/video';

export default class OpenEndedGameStore {
  @observable gameData: VideoGameDto[] = [];
  @observable saveNotification = false;
  @observable countActivity = 0;
  templateArray = new Map();
  @observable allTimecode: { timeCode: number; gameType: VideoGameType }[] = [];

  constructor() {
    autoBind(this);
    makeObservable(this);
  }

  @action
  setGameData(createData: VideoGameDto) {
    this.gameData = [...this.gameData, createData];
  }

  @action
  setTimeCode() {
    this.gameData.map((item) => {
      return this.allTimecode.some((someItem) => {
        return someItem.timeCode === item.timeCode;
      })
        ? this.allTimecode
        : (this.allTimecode = [
            ...this.allTimecode,
            { timeCode: item.timeCode, gameType: item.gameType },
          ]);
    });
    return this.allTimecode;
  }

  @action gameDataByTimeCode(timeCode: number) {
    return this.gameData
      ?.slice()
      .sort((a, b) => a.gameType.localeCompare(b.gameType))
      .filter((f) => f.timeCode === timeCode);
  }

  @action
  setSaveNotification(value: boolean) {
    this.saveNotification = value;
  }

  @action
  removeEmptyQuestion() {
    this.gameData = this.gameData.filter((filteredElement) => {
      return filteredElement.question !== '';
    });
  }

  @action
  changeQuestion(id: string, value: string) {
    this.gameData = this.gameData.map((dataItem) => {
      return dataItem.id === id ? { ...dataItem, question: value } : dataItem;
    });
  }

  @action changeOption(gameId, optionId, value: string) {
    this.gameData = this.gameData.map((dataItem) => {
      return dataItem.id === gameId
        ? {
            ...dataItem,
            answer: {
              ...dataItem.answer,
              option: dataItem.answer.option.map((m) =>
                m.id === optionId
                  ? {
                      ...m,
                      value: value,
                    }
                  : m
              ),
            },
          }
        : dataItem;
    });
  }

  @action returnVideoGameData(timeCode: number) {
    return this.gameData
      ?.slice()
      .sort((a, b) => a.gameType.localeCompare(b.gameType))
      .filter((f) => f.timeCode === timeCode);
  }

  @action async changeCorrect(gameId: string, value: string) {
    this.gameData = this.gameData.map((dataItem) => {
      return dataItem.id === gameId
        ? {
            ...dataItem,
            answer: {
              ...dataItem.answer,
              correct: [...(dataItem.answer.correct as string[]), value],
            },
          }
        : dataItem;
    });
  }

  @action async deleteCorrect(gameId: string, value: string) {
    this.gameData = this.gameData.map((dataItem) => {
      return dataItem.id === gameId
        ? {
            ...dataItem,
            answer: {
              ...dataItem.answer,
              correct: (dataItem.answer.correct as string[]).filter((f) => f !== value),
            },
          }
        : dataItem;
    });
  }

  @action checkedCorrect(gameId: string, value: string) {
    const tempArray = [];
    for (let i = 0; i < this.gameData.length; i++) {
      this.gameData[i].id === gameId &&
        tempArray.push(...(this.gameData[i].answer.correct as string[]));
    }
    return tempArray.includes(value);
  }

  @action deleteOption(gameId, optionId) {
    this.gameData = this.gameData.map((dataItem) => {
      return dataItem.id === gameId
        ? {
            ...dataItem,
            answer: {
              ...dataItem.answer,
              option: dataItem.answer.option.filter((m) => m.id !== optionId),
            },
          }
        : dataItem;
    });
  }

  @action
  addOption(questionId: string) {
    this.gameData = this.gameData.map((dataItem) => {
      const option = dataItem.answer?.option;
      const correct = dataItem.answer?.correct as string[];
      return dataItem.gameType === 'multiple_choice' && dataItem.id === questionId
        ? {
            ...dataItem,
            answer: { option: [...option, { id: uuidv4(), value: '' }], correct: [...correct] },
          }
        : dataItem;
    });
  }

  @action
  changeAnswerTrueFalse(id: string, value: boolean) {
    this.gameData = this.gameData.map((dataItem) => {
      return dataItem.id === id ? { ...dataItem, answer: { correct: value } } : dataItem;
    });
  }

  @action resetData() {
    this.gameData = [];
    this.templateArray.clear();
    this.allTimecode = [];
    this.countActivity = 0;
  }

  @action
  addNewQuestion(videoGame: VideoGameType, questionTimeCode?: number) {
    const timeCode = questionTimeCode ? questionTimeCode : Math.floor(videoStore.state.time);

    let answerOption: VideoGameAnswerType;

    switch (videoGame) {
      case 'multiple_choice':
        answerOption = {
          option: [
            { id: uuidv4(), value: '' },
            { id: uuidv4(), value: '' },
          ],
          correct: [],
        };
        break;
      case 'open_end_question':
        answerOption = null;
        break;
      case 'true_or_false':
        answerOption = { correct: true };
        break;
    }

    this.gameData = [
      ...this.gameData,
      {
        timeCode: timeCode,
        gameType: videoGame,
        id: uuidv4(),
        question: '',
        answer: answerOption,
      },
    ];
  }

  @action incrementCounterActivity(timecode: number) {
    this.countActivity = this.countActivity + 1;
    this.templateArray.set(`${timecode}`, `${openEndedGameStore.countActivity}`);
  }

  @action decrementCounterActivity(timecode: number) {
    this.countActivity = this.countActivity - 1;
    this.templateArray.delete(`${timecode}`);
  }

  @action deleteItemTimeCode(value: { timeCode: number; gameType: VideoGameType }[]) {
    this.allTimecode = value;
  }

  @action deleteByGameType(gameType: VideoGameType, timeCode: number) {
    this.allTimecode.filter((el) => {
      if (el.timeCode === timeCode) {
        return el.gameType !== gameType;
      } else return true;
    });
    this.gameData = this.gameData.filter((element) => {
      if (element.timeCode === timeCode) {
        return element.gameType !== gameType;
      } else return true;
    });
  }

  @action
  deleteQuestion(id: string | number) {
    this.gameData = this.gameData.filter((element) => element.id !== id);
  }
}
