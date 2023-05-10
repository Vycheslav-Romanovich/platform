import { Storage } from '@capacitor/storage';
import autoBind from 'auto-bind';
import { action, makeAutoObservable, observable, observe } from 'mobx';

import { IListItem, IVideoItem } from '~/types/video';

class RecommendedVideosStore {
  private readonly storageName: string = 'recomendedVideos';

  @observable.shallow videos: IListItem[] | IVideoItem[] = [];

  constructor() {
    autoBind(this);
    makeAutoObservable(this);
    this.init().then();
  }

  @action
  async init() {
    if (typeof window !== 'undefined') {
      const recomendedVideos = await Storage.get({ key: this.storageName });
      this.videos = JSON.parse(recomendedVideos.value) || [];

      if (!recomendedVideos.value) {
        Storage.set({ key: this.storageName, value: JSON.stringify([]) });
      }
    }
    observe(this, 'videos', ({ newValue }) => {
      if (newValue) {
        Storage.set({ key: this.storageName, value: JSON.stringify(newValue) });
      }
    });
  }

  @action
  async set(videos: IListItem[] | IVideoItem[]) {
    this.videos = videos;
  }

  @action
  async get() {
    return this.videos;
  }

  @action
  async remove() {
    this.videos = [];
  }
}

export default RecommendedVideosStore;
