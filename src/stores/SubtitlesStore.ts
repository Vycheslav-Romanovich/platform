import autoBind from 'auto-bind';
import he from 'he';
import { action, computed, makeObservable, observable } from 'mobx';

import { userStore, videoStore } from '~/stores/index';
import { OneSubtitle, Subtitles } from '~/types/subtitles';

export default class SubtitlesStore {
  @observable subtitles: Subtitles[] = [];
  @observable openContextMenu = false;
  @observable highlightWord = true;
  @observable showedFingerSubtitle = false;
  @observable currentSubtitlesId: number | undefined = 0;
  @observable time = 0;
  @observable isAlwaysShowed = false;
  @observable getTranslationClickedTimes: number | null = 1;
  @observable isFastSubtitlesReady = false;
  @observable translateSubtitle: Subtitles | null = null;
  @observable subtitleMode: 'from' | 'to' | 'Dual Subtitles' | 'Off' = 'from';

  constructor() {
    autoBind(this);
    makeObservable(this);
  }

  clearTags(text: string) {
    const textWithotExtraSymbols = he.decode(text);
    return textWithotExtraSymbols.replace(/<\/?[^>]+(>|$)/g, '');
  }

  @action setSubtitleMode(value: 'from' | 'to' | 'Dual Subtitles' | 'Off') {
    this.subtitleMode = value;
  }

  @action setTime(time: number) {
    this.time = time;
  }

  @action setContextMenu(value: boolean) {
    this.openContextMenu = value;
  }

  @action setFingerSubtitle(value: boolean) {
    this.showedFingerSubtitle = value;
    videoStore.setPause(value);
  }

  @action setIsAlwaysShowed(val: boolean) {
    this.isAlwaysShowed = val;
  }

  @action
  async setSubtitles(subs: Subtitles[]) {
    if (!subs || subs.length === 0) return [];

    const promiseArr = subs.map(async (sub) => {
      sub.subtitles.forEach((subt) => {
        subt.text = this.clearTags(subt.text);
      });

      //get idions

      // if (sub.lang.indexOf('en') !== -1) {
      //   const idiomSentences: IdiomsSentenceRequest[] = sub.subtitles.map((subtitle) => ({
      //     sentence: subtitle.text,
      //     sentenceID: subtitle.id,
      //   }));
      //   const idiomResp = await api.getIdiomsSentence(idiomSentences);
      //   const newSub = sub;
      //   idiomResp.data.foundIdiomsArray.forEach((idiom) => {
      //     const curSub = newSub.subtitles.find((subtitle) => subtitle.id === idiom.sentenceID);
      //     curSub !== undefined && (curSub.idioms = idiom.idioms);
      //   });
      //   return newSub;
      // }
      return sub;
    });
    this.subtitles = await Promise.all(promiseArr);
    const indexFrom = subs.findIndex((sub) =>
      sub.lang === userStore.user?.from ? userStore.user?.from : 'en'
    );
    if (indexFrom !== -1) {
      this.setCurrentSubtitlesId(subs[indexFrom].id);
    } else {
      this.setCurrentSubtitlesId(subs[0].id);
    }
    return this.subtitles;
  }

  @action
  async addSubtitles(sub: Subtitles) {
    this.subtitles.push(sub);
    return sub;
  }

  @action
  async setTranslateSubtitle(subs: Subtitles | null) {
    this.translateSubtitle = subs;
  }

  @action
  async pushTranslateSubtitlePack(subs: OneSubtitle[]) {
    const subtitles = [...this.translateSubtitle.subtitles, ...subs];

    this.translateSubtitle = {
      ...this.translateSubtitle,
      subtitles,
    };
  }

  @action
  async setFastSubtitleReady(value: boolean) {
    this.isFastSubtitlesReady = value;
    return this.isFastSubtitlesReady;
  }

  @action subtitleByTime(time: number) {
    for (let i = 0; i < this.currentSubtitles.length - 1; i++) {
      const curSub = this.currentSubtitles[i];
      if (time >= curSub.startTime && time < curSub.endTime) {
        return curSub.id;
      } else if (i === 0 && time < curSub.startTime) {
        return curSub.id;
      }
    }
    return this.currentSubtitles && this.currentSubtitles[0] && this.currentSubtitles[0].id;
  }

  @action
  async replaceSubtitles(index: number, subs: OneSubtitle[]) {
    this.subtitles[index].subtitles = subs;
    return this.subtitles;
  }

  @action setSubtitlesTranslation(text: string) {
    this.currentSubtitle.translation = text;
  }

  @action clear() {
    this.subtitles = [];
    this.setCurrentSubtitlesId(undefined);
  }

  @computed get isExist() {
    return this.subtitles.length > 0 && this.currentSubtitlesId !== undefined;
  }

  @computed get subtitlesIds() {
    return this.subtitles.map((s) => s.id);
  }

  private getSubtitlesById(id: number | undefined): OneSubtitle[] {
    const current = this.subtitles.find((s) => s.id === id);
    return current ? current.subtitles : [];
  }

  @computed get currentSubtitles(): OneSubtitle[] {
    return this.getSubtitlesById(this.currentSubtitlesId);
  }

  private getSubtitleIdByTime(subtitles = this.currentSubtitles) {
    if (subtitles) {
      for (let i = 0; i < subtitles.length - 1; i++) {
        const curSub = subtitles[i];
        const nextSub = subtitles[i + 1];
        if (this.time >= curSub.startTime && this.time < nextSub.startTime) {
          return curSub.id;
        } else if (i === 0 && this.time < curSub.startTime) {
          return curSub.id;
        } else if (i === subtitles.length - 2 && this.time >= nextSub.startTime) {
          return nextSub.id;
        }
      }
    }

    return subtitles && subtitles[0] && subtitles[0].id;
  }

  @computed get currentSubtitleId(): number {
    return this.getSubtitleIdByTime();
  }

  getSubtitlesNameById(id: number) {
    const subtitles = this.subtitles.find((s) => s.id === id);
    return subtitles ? subtitles.name : undefined;
  }

  getSubtitleById(id = this.currentSubtitleId, arr = this.currentSubtitles) {
    return arr.find((e) => e.id === id);
  }

  @computed get currentSubtitle(): OneSubtitle {
    return this.getSubtitleById();
  }

  @computed get currentSubtitleTime() {
    if (!this.isExist) return;
    return this.getSubtitleById().startTime;
  }

  @computed get prevSubtitleTime() {
    if (!this.isExist) return;
    const firstId = this.currentSubtitles[0].id;
    if (this.currentSubtitleId > firstId) {
      return this.getSubtitleById(this.currentSubtitleId - 1).startTime;
    } else {
      return 0;
    }
  }

  @computed get nextSubtitleTime() {
    if (!this.isExist) return;
    const curSub = this.currentSubtitles;
    const lastId = curSub[curSub.length - 1]?.id;
    if (lastId && this.currentSubtitleId < lastId) {
      return this.getSubtitleById(this.currentSubtitleId + 1).startTime;
    } else {
      return this.getSubtitleById(lastId)?.startTime;
    }
  }

  @action setCurrentSubtitlesId(id: number | undefined) {
    this.currentSubtitlesId = id;
  }

  @action setGetTranslationClickedTimes(value: number | null) {
    this.getTranslationClickedTimes = value;
  }

  getContextSelectedWord() {
    const id = this.currentSubtitleId;
    const startText = this.currentSubtitle.text;
    const nextSub = this.getSubtitleById(id + 1);
    let prev = true,
      next = !!nextSub,
      text = startText,
      nextText = nextSub && nextSub.text;

    for (let i = 1; prev || next; i++) {
      if (
        prev &&
        text.match(/\w\s/) &&
        text.match(/\w\s/)[0] === text.match(/\w\s/)[0].toLowerCase() &&
        this.getSubtitleById(id - i)
      ) {
        text = this.getSubtitleById(id - i).text + ` ${text}`;
        prev = false;
      } else prev = false;

      if (
        next &&
        nextText.match(/\w\s/) &&
        nextText.match(/\w\s/)[0] === nextText.match(/\w\s/)[0].toLowerCase() &&
        this.getSubtitleById(id + 1 + i)
      ) {
        text += ` ${this.getSubtitleById(id + i).text}`;
        nextText = this.getSubtitleById(id + 1 + i).text;
        next = false;
      } else next = false;
    }
    return { text, index: text.indexOf(startText) };
  }
}
