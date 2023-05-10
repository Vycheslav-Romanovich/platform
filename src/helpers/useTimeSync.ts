import { useEffect } from 'react';
import { observe } from 'mobx';

import { subtitlesStore, videoStore } from '~/stores';

export default function useHook() {
  useEffect(() => {
    const disposer = observe(videoStore.state, 'time', (e) => {
      const newTime: any = e.newValue;
      const oldTime: any = e.oldValue;
      const nextSubTime = subtitlesStore.nextSubtitleTime;
      if (
        videoStore.waitPause &&
        nextSubTime &&
        newTime >= nextSubTime &&
        oldTime < nextSubTime &&
        Math.abs(newTime - oldTime) <= (videoStore.progressInterval * 2) / 1000
      ) {
        videoStore.setPause(true);
        videoStore.setWaitPause(false);
      } else if (!videoStore.state.isPause) {
        subtitlesStore.setTime(newTime);
      }
    });
    return () => {
      disposer();
    };
  }, []);
}
