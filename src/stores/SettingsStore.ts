import { Device } from '@capacitor/device';
import autoBind from 'auto-bind';
import { action, makeObservable, observable } from 'mobx';

import { ListItem } from '~/types/video';

export default class SettingsStore {
  @observable listTagsVideos: ListItem[] | [];
  @observable firstRenderVideo = true;
  @observable deviceLang: string | undefined;
  @observable modeSetting: 'setting' | 'speed' | 'subtitle' = 'setting';

  constructor() {
    autoBind(this);
    makeObservable(this);
    this.init().then();
    this.listTagsVideos = [];
  }

  @action setModeSetting(value: 'setting' | 'speed' | 'subtitle') {
    this.modeSetting = value;
  }

  async init() {
    if (typeof window !== 'undefined') {
      const language = await Device.getLanguageCode();
      this.deviceLang = language.value.substr(0, 2).toLowerCase();
    }
  }

  @action setFirstRenderVideo(value: boolean) {
    this.firstRenderVideo = value;
  }

  @action setListTagsVideos(list: ListItem[]) {
    this.listTagsVideos = list;
  }
}
