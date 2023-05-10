import ReactPlayer from 'react-player';
import autoBind from 'auto-bind';
import { action, makeAutoObservable, observable, observe } from 'mobx';

import api from '~/api_client/api';
import { sortStore } from '~/stores/index';
import { ActionMode } from '~/types/subtitles';

const speedDefault = 1;

const initState = {
  time: 0,
  duration: 0,
  loaded: 0,
  isReady: false,
  characters: 0,
  isPause: false,
  videoId: '',
  isPauseFromRepeat: false,
  volume: 0.5,
  muted: false,
  flagBlur: false,
  boolVideoBlur: false,
  shortVideo: false,
  shortStart: 0,
  speed: speedDefault,
  seeking: false,
  recommendedBlock: false,
  fullscreen: false,
  isSearch: false,
  openSetting: false,
  openEndModal: false,
  openVideoModal: false,
  middleStateScreen: false,
  clicks: 0,
  dblClickTimeSpan: 500,
  editVideoId: '',
  createLessonMode: false,
  showActivityMode: false,
  showVideoSetting: false,
};

export default class VideoStore {
  @observable state = initState;
  @observable info = {
    title: '',
    url: '',
  };
  @observable waitPause = false;
  @observable hotkeysAvailable = true;
  @observable actionMode: ActionMode = null;
  @observable foundVideos = null;
  @observable foundVideosItems = true;
  @observable isFullScreen = false;
  private lastSetTime = 0;

  readonly progressInterval: number = 100;
  playerRef: ReactPlayer | null = null;
  private timeoutActionMode: undefined | ReturnType<typeof setTimeout> = null;

  constructor() {
    autoBind(this);
    makeAutoObservable(this);
    observe(this.state, 'seeking', ({ newValue }: any) => {
      this.state.isPause = newValue;
    });
  }

  @action
  setIsScreenFull() {
    this.isFullScreen = !this.isFullScreen;
  }

  @action setTime(time: number | null) {
    if (this.playerRef) {
      if (this.state.seeking && time >= 0) {
        this.state.time = Math.round(time);
      }
      time >= 0 && (this.lastSetTime = Math.round(time));
      time >= 0 && this.playerRef.seekTo(Math.round(time), 'seconds');
    }
  }

  @action setProgress(time: number, loaded: number) {
    if (time >= this.lastSetTime) {
      this.state.time = Math.round(time);
    } else {
      this.state.time = this.lastSetTime;
    }
    this.state.loaded = loaded;
  }

  @action setFullscreen(value: boolean) {
    this.state.fullscreen = value;
  }

  @action setShowVideoSetting(value: boolean) {
    this.state.showVideoSetting = value;
  }
  @action videoSearchReset() {
    this.foundVideos = null;
  }

  @action setShowActivityMode(value: boolean) {
    this.state.showActivityMode = value;
  }

  @action setShortVideo(value: boolean) {
    this.state.shortVideo = value;
  }

  @action setCreateLessonMode(value: boolean) {
    this.state.createLessonMode = value;
  }

  @action setEditVideoId(id: string) {
    this.state.editVideoId = id;
  }

  @action setShortStart(value: number) {
    this.state.shortStart = value;
  }

  @action setClick(value: number) {
    this.state.clicks = value;
  }

  @action setMiddleStateScreen(value: boolean) {
    this.state.middleStateScreen = value;
  }

  @action setOpenEndVideoModal(value: boolean) {
    this.state.openEndModal = value;
  }

  @action setOpenVideoModal(value: boolean) {
    this.state.openVideoModal = value;
  }

  @action setVolume(volume: number) {
    this.state.volume = volume;
  }

  @action setCharacters(characters: number) {
    this.state.characters = characters;
  }

  @action setBlurFlag(value: boolean) {
    this.state.flagBlur = value;
  }

  @action setId(id: string) {
    this.state.videoId = id;
  }

  @action setDuration(duration: number) {
    this.state.duration = duration;
  }

  @action setPause(isPause?: boolean) {
    this.state.isPause = isPause === undefined ? true : isPause;
  }

  @action setPauseFromGetTranslation(isPause: boolean) {
    this.state.isPause = isPause;
  }

  @action setPauseFromRepeat(isPause: boolean, isToggleHideSubs?: boolean) {
    this.state.isPauseFromRepeat = isPause;
    this.state.isPause && !isToggleHideSubs && this.setPause();
  }

  @action togglePause() {
    this.state.isPause = !this.state.isPause;
    this.state.recommendedBlock && this.setRecommended(false);
  }

  @action toggleMute() {
    this.state.muted = !this.state.muted;
  }

  @action setLoaded(loaded: number) {
    this.state.loaded = loaded;
  }

  @action setIsReady(ready: boolean) {
    this.state.isReady = ready;
  }

  @action setSeeking(seeking: boolean) {
    this.state.seeking = seeking;
  }

  @action setSearch(search: boolean) {
    this.state.isSearch = search;
  }

  setPlayerRef(ref: ReactPlayer) {
    this.playerRef = ref;
  }

  @action toggleVideoBlur(value?: boolean) {
    value
      ? (this.state.boolVideoBlur = value)
      : (this.state.boolVideoBlur = !this.state.boolVideoBlur);
  }

  @action speedReset() {
    if (this.state.speed === 0.5) {
      this.state.speed = 0.75;
    } else if (this.state.speed === 0.7) {
      this.state.speed = 1;
    } else if (this.state.speed === 0.95) {
      this.state.speed = 1.25;
    } else if (this.state.speed === 1) {
      this.state.speed = 1.5;
    } else if (this.state.speed === 0.3) {
      this.state.speed = 0.5;
    }
  }

  @action setSpeed(speed: number) {
    this.state.speed = speed;
  }

  @action setRecommended(state: boolean) {
    this.state.recommendedBlock = state;
  }

  @action setOpenSettings(open: boolean) {
    this.state.openSetting = open;
  }

  @action setWaitPause(is: boolean) {
    this.waitPause = is;
  }

  @action setInfo(info: { title: string; url?: string }) {
    this.info = { ...this.info, ...info };
  }

  @action reset() {
    this.state = initState;
    this.lastSetTime = 0;
  }

  @action resetTime() {
    this.state = { ...this.state, time: 0 };
  }

  @action clearAction() {
    this.actionMode = null;
    this.timeoutActionMode = undefined;
  }

  @action setActionMode(value: ActionMode, time = 1000) {
    if (value === 'translateOff' || value === 'translateOn') {
      this.state.isPauseFromRepeat && this.setPauseFromRepeat(false, true);
    }
    if (this.timeoutActionMode) {
      this.actionMode = null;
      clearTimeout(this.timeoutActionMode);
    }
    this.actionMode = value;
    this.timeoutActionMode = setTimeout(() => {
      this.actionMode = null;
      this.timeoutActionMode = undefined;
    }, time);
  }

  @action setHotkeysAvailable(val: boolean) {
    return (this.hotkeysAvailable = val);
  }

  @action
  async setVideosResult(videoTag: string, from?: string) {
    this.foundVideosItems = true;
    this.foundVideos = await api.search(
      videoTag,
      '',
      sortStore.sortDuration,
      sortStore.sortSearchOrder,
      from
    );
    if (!this.foundVideos.items.length) {
      this.foundVideosItems = false;
    }
  }

  @action
  async setVideosResultById(id: string) {
    this.foundVideosItems = true;
    const videoItem = await api.getVideoById(id);
    this.foundVideos = videoItem.data;
    if (!this.foundVideos.items.length) {
      this.foundVideosItems = false;
    }
  }

  @action
  async updateVideosResult(videoTag: string, from?: string) {
    const nextPage = await this.foundVideos.nextPageToken;
    const { items, nextPageToken } = await api.search(
      videoTag,
      nextPage,
      sortStore.sortDuration,
      sortStore.sortSearchOrder,
      from
    );
    items.shift();
    const pushedItems = this.foundVideos.items.concat(items);
    this.foundVideos = {
      ...this.foundVideos,
      ...{ items: pushedItems, nextPageToken: nextPageToken },
    };
  }
}
