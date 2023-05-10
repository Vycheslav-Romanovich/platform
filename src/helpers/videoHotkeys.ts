import videoAction from './videoAction';

import { handleBtnPress } from '~/helpers/handleVideoHotkeysPress';
import { sendHotkeyToGTM } from '~/helpers/sendToGtm';
import { videoStore } from '~/stores';

const observeKeyDown = (e) => {
  if (e.target.tagName !== 'INPUT' && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey)
    switch (e.keyCode) {
      case 80:
      case 37:
        if (videoStore.hotkeysAvailable) {
          e.preventDefault();
          videoAction.prevSubtitle();
          handleBtnPress('prev');
          sendHotkeyToGTM(e);
        }
        break;
      case 38:
      case 83:
        if (videoStore.hotkeysAvailable) {
          e.preventDefault();
          videoAction.slowRepeatSubtitle();
          handleBtnPress('slow repeat');
          sendHotkeyToGTM(e);
        }
        break;
      case 39:
      case 78:
        if (videoStore.hotkeysAvailable) {
          e.preventDefault();
          videoAction.nextSubtitle();
          handleBtnPress('next');
          sendHotkeyToGTM(e);
        }
        break;
      case 32:
        if (videoStore.hotkeysAvailable) {
          e.preventDefault();
          videoAction.togglePause();
          sendHotkeyToGTM(e);
        }
        break;
      case 82:
      case 40:
        if (videoStore.hotkeysAvailable) {
          e.preventDefault();
          videoAction.repeatSubtitle();
          handleBtnPress('repeat');
          sendHotkeyToGTM(e);
        }
        break;
    }
};

const add = () => {
  document.addEventListener('keydown', observeKeyDown);
};

const remove = () => {
  document.removeEventListener('keydown', observeKeyDown);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { add, remove };
