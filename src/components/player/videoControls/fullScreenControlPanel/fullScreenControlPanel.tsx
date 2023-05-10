import React, { ReactNode, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { observer } from 'mobx-react';

import DualSubtitles from '~/assets/icons/video_controls/fullScreenControlPanelIcons/dual-subtitles.svg';
import Next from '~/assets/icons/video_controls/fullScreenControlPanelIcons/next.svg';
import Previous from '~/assets/icons/video_controls/fullScreenControlPanelIcons/previous.svg';
import Repeat from '~/assets/icons/video_controls/fullScreenControlPanelIcons/repeat.svg';
import Slow from '~/assets/icons/video_controls/fullScreenControlPanelIcons/slow.svg';

import styles from '~/components/player/videoControls/fullScreenControlPanel/fullScreenControlPanel.module.scss';

import { handleBtnPress } from '~/helpers/handleVideoHotkeysPress';
import { sendEvent } from '~/helpers/sendToGtm';
import videoAction from '~/helpers/videoAction';
import { subtitlesStore, videoStore } from '~/stores';

interface ButtonData {
  icon: ReactNode;
  isOpen: boolean;
  onOpenOrClose: (value: boolean) => void;
  tooltipTitle: string;
  onClickHandler: () => void;
}

const FullScreenControlPanel = () => {
  const [dualSubtitlesTooltip, setDualSubtitlesTooltip] = useState(false);
  const [repeatTooltip, setRepeatTooltip] = useState(false);
  const [slowTooltip, setSlowTooltip] = useState(false);
  const [previousTooltip, setPreviousTooltip] = useState(false);
  const [nextTooltip, setNextTooltip] = useState(false);

  const buttons: ButtonData[] = [
    {
      icon: <DualSubtitles />,
      isOpen: dualSubtitlesTooltip,
      tooltipTitle: 'Dual subtitles',
      onOpenOrClose: setDualSubtitlesTooltip,
      onClickHandler: () => {
        if (subtitlesStore.isAlwaysShowed) {
          sendEvent('dual_subs_click', { power: 'Off' });
          handleBtnPress('translateOff');
          subtitlesStore.setIsAlwaysShowed(false);
        } else {
          sendEvent('dual_subs_click', { power: 'On' });
          handleBtnPress('translateOn');
          subtitlesStore.setIsAlwaysShowed(true);
        }
      },
    },
    {
      icon: <Repeat />,
      isOpen: repeatTooltip,
      onOpenOrClose: setRepeatTooltip,
      tooltipTitle: 'Repeat subtitle',
      onClickHandler: () => {
        videoAction.repeatSubtitle();
        handleBtnPress('repeat');
      },
    },
    {
      icon: <Slow />,
      isOpen: slowTooltip,
      onOpenOrClose: setSlowTooltip,
      tooltipTitle: 'Repeat subtitle slow',
      onClickHandler: () => {
        videoAction.slowRepeatSubtitle();
        handleBtnPress('slow repeat');
      },
    },
    {
      icon: <Previous />,
      isOpen: previousTooltip,
      onOpenOrClose: setPreviousTooltip,
      tooltipTitle: 'Previous subtitle',
      onClickHandler: () => {
        videoAction.prevSubtitle();
        handleBtnPress('prev');
      },
    },
    {
      icon: <Next />,
      isOpen: nextTooltip,
      onOpenOrClose: setNextTooltip,
      tooltipTitle: 'Next subtitle',
      onClickHandler: () => {
        videoAction.nextSubtitle();
        handleBtnPress('next');
      },
    },
  ];

  return (
    <div
      style={
        videoStore.state.isPause
          ? {
              backgroundColor: 'rgba(19, 28, 50, 0.8)',
              backdropFilter: 'blur(60px)',
            }
          : null
      }
      className={styles.fullScreenControlPanel}
    >
      {buttons.map((button, index) => {
        return (
          <Tooltip
            classes={{
              tooltip: styles.tooltip,
            }}
            PopperProps={{ container: document.getElementById('full-screen-tooltips-container') }}
            key={index}
            arrow
            placement="right"
            title={button.tooltipTitle}
            open={button.isOpen}
            onClose={() => button.onOpenOrClose(false)}
            onOpen={() => button.onOpenOrClose(true)}
          >
            <div onClick={button.onClickHandler} className={styles.fullScreenControlPanelButtons}>
              {button.icon}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default observer(FullScreenControlPanel);
