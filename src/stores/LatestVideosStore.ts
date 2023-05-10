import { Storage } from '@capacitor/storage';
import autoBind from 'auto-bind';
import { action, observable } from 'mobx';

class LatestVideosStore {
  private readonly storageLatestVideoName = 'last-watch-video-id';
  private readonly storageLatestVideoTime = 'last-watch-video-time';

  @observable latestVideoId: string | null | undefined = null;
  @observable latestVideoTime: number | null = null;
  @observable episodeEndTime: number | null = null;

  constructor() {
    autoBind(this);
    this.init().then();
  }

  @action
  async init() {
    if (typeof window !== 'undefined') {
      const latestVideoId = await Storage.get({
        key: this.storageLatestVideoName,
      });
      const latestVideoTime = Number(
        (await Storage.get({ key: this.storageLatestVideoTime })).value
      );

      if (latestVideoId && latestVideoTime) {
        this.latestVideoId = latestVideoId.value;
        this.latestVideoTime = latestVideoTime;
      }
    }
  }

  @action
  async setLatestVideoId(id: string | undefined) {
    this.latestVideoId = id;
    id &&
      (await Storage.set({
        key: this.storageLatestVideoName,
        value: id,
      }));
  }

  @action
  async setLatestVideoTime(time: number) {
    this.latestVideoTime = time;
    await Storage.set({
      key: this.storageLatestVideoTime,
      value: String(time),
    });
  }

  @action
  async setEpisodeEndTime(time: number | null) {
    this.episodeEndTime = time;
  }
}

export default LatestVideosStore;
