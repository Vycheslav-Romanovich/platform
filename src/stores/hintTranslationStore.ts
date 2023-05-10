import autoBind from 'auto-bind';
import { action, makeAutoObservable, observable } from 'mobx';

import api from '~/api_client/api';
import { AddWordResponse, AllPartOfSpeech } from '~/types/api';

export default class HintTranslationStore {
  @observable translateWord: AddWordResponse;
  @observable translation: AllPartOfSpeech[] = [];
  @observable isOnFocus = false;
  @observable isLoading = false;

  constructor() {
    autoBind(this);
    makeAutoObservable(this);
  }

  @action setTranslateWord(word: AddWordResponse) {
    this.translateWord = word;
  }

  @action setIsOnFocus(isOnFocus: boolean) {
    this.isOnFocus = isOnFocus;
  }

  @action async setTranslation() {
    try {
      this.setLoading(true);
      const translateHint = await api.translateSynonyms(this.translateWord.word.toLowerCase());
      await this.setLoading(false);
      this.translation = translateHint;
    } catch (error) {
      console.error(error);
    }
  }

  @action resetTranslation() {
    this.translateWord = undefined;
    this.translation = [];
  }

  @action setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  @action getTranslation(wordPair: AddWordResponse) {
    this.resetTranslation();
    this.setIsOnFocus(false);
    this.setTranslateWord(wordPair);
    this.setTranslation();
    this.setIsOnFocus(true);
  }
}
