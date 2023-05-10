/* eslint-disable import/no-anonymous-default-export */
import { observe } from 'mobx';

import { sendEvent } from '~/helpers/sendToGtm';
import { subtitlesStore, videoStore } from '~/stores';

let disposer: any;

export default {
  isSlowly: false,
  _setTime: function (time: number) {
    // Turn off auto-pause after video hotkeys
    // videoStore.setWaitPause(true);
    if (this.isSlowly) {
      videoStore.speedReset();
      this.isSlowly = false;
    }
    videoStore.setTime(time);
  },
  pause: function () {
    videoStore.setPause(true);
  },
  play: function () {
    videoStore.setPause(false);
  },
  togglePause: function () {
    videoStore.togglePause();
  },
  _changeSubtitle: function () {
    if (videoStore.state.isPause) {
      videoStore.setPause(false);
    }
  },
  setSubtitleById: function (id: number) {
    this._changeSubtitle();
    subtitlesStore.isExist &&
      id &&
      subtitlesStore.getSubtitleById(id) &&
      this._setTime(subtitlesStore.getSubtitleById(id).startTime);
  },
  prevSubtitle: function () {
    sendEvent('prev_sub_click');
    this._changeSubtitle();
    subtitlesStore.isExist
      ? this._setTime(subtitlesStore.prevSubtitleTime)
      : this._setTime(videoStore.state.time - 5 < 0 ? 0 : videoStore.state.time - 5);
  },
  nextSubtitle: function () {
    sendEvent('next_sub_click');
    this._changeSubtitle();
    subtitlesStore.isExist
      ? this._setTime(subtitlesStore.nextSubtitleTime)
      : this._setTime(
          videoStore.state.time + 5 > videoStore.state.duration
            ? videoStore.state.duration
            : videoStore.state.time + 5
        );
  },

  repeatSubtitle: function () {
    this._changeSubtitle();
    sendEvent('repeat_click');
    videoStore.setActionMode('repeat');
    subtitlesStore.isExist && this._setTime(subtitlesStore.currentSubtitleTime);
  },

  slowRepeatSubtitle: function (
    speed = 0.7,
    startTime = subtitlesStore.currentSubtitleTime,
    endTime = subtitlesStore.nextSubtitleTime
  ) {
    sendEvent('slow_repeat_click');
    videoStore.setActionMode('slow repeat');
    this._changeSubtitle();
    if (!subtitlesStore.isExist) return;
    disposer && disposer();
    this._setTime(startTime);
    videoStore.setSpeed(speed);
    this.isSlowly = true;
    const nextTime = endTime;
    disposer = observe(videoStore.state, 'time', ({ newValue }: any) => {
      if (!this.isSlowly) {
        return disposer();
      }
      if (newValue >= nextTime) {
        videoStore.speedReset();
        this.isSlowly = false;
        return disposer();
      }
    });
  },
};
