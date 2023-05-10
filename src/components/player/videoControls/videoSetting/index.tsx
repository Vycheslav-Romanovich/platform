import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { ClickAwayListener, Tooltip } from '@mui/material';
import { observer } from 'mobx-react';

import PopoverSubtitleContent from './popoverSubtitleContent/popoverSubtitleContent';

import styles from '~/components/player/videoControls/videoSetting/videoSetting.module.scss';

import PopoverInnerContent from '~/components/player/videoControls/videoSetting/popoverInnerContent/popoverInnerContent';
import PopoverSettingContent from '~/components/player/videoControls/videoSetting/popoverSettingContent/popoverSettingContent';
import { settingsStore, videoStore } from '~/stores';

const VideoSettingButton = () => {
  const { modeSetting, setModeSetting } = settingsStore;

  const tooltipContent = () => {
    switch (modeSetting) {
      case 'setting':
        return <PopoverSettingContent />;
      case 'speed':
        return <PopoverInnerContent />;
      case 'subtitle':
        return <PopoverSubtitleContent />;
    }
  };

  return (
    <ClickAwayListener onClickAway={() => videoStore.setShowVideoSetting(false)}>
      <div className={styles.changeSpeedWrapper}>
        <Tooltip
          placement={'top'}
          classes={{
            tooltip: styles.tooltip,
          }}
          PopperProps={{ container: document.getElementById('full-screen-tooltips-container') }}
          onOpen={() => videoStore.setShowVideoSetting(true)}
          onClose={() => videoStore.setShowVideoSetting(false)}
          open={videoStore.state.showVideoSetting}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={tooltipContent()}
        >
          <div
            className={styles.settingIcon}
            onClick={() => {
              setModeSetting('setting');
              videoStore.setShowVideoSetting(!videoStore.state.showVideoSetting);
            }}
          >
            <SettingsIcon />
          </div>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default observer(VideoSettingButton);
