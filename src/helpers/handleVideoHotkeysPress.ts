import { subtitlesStore, videoStore } from '~/stores';
import { ActionMode } from '~/types/subtitles';

export const handleBtnPress = (type: ActionMode) => {
  const duration = (subtitlesStore.nextSubtitleTime - subtitlesStore.currentSubtitleTime) * 1000;
  if (type === 'prev' || type === 'next') {
    videoStore.setActionMode(type, 500);
  } else if (type === 'repeat') {
    videoStore.setActionMode(type, duration);
  } else if (type === 'slow repeat') {
    videoStore.setActionMode(type, duration * 1.3);
  } else if (type === 'translateOn' || type === 'translateOff') {
    videoStore.setActionMode(type, 1500);
  }
};
