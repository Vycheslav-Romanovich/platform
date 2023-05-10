import React, { useState } from 'react';
import { ClickAwayListener, Slider } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { observer } from 'mobx-react';

import Volume from '/src/assets/icons/video_controls/volume.svg';
import VolumeHalf from '/src/assets/icons/video_controls/volume_half.svg';
import VolumeMute from '/src/assets/icons/video_controls/volume_muted.svg';

import styles from '~/components/player/videoControls/changeVolume/changeVolume.module.scss';

import { videoStore } from '~/stores';

const ChangeVolumeButton = () => {
  const { setVolume } = videoStore;
  const { volume } = videoStore.state;
  const [showVolumeWindow, setShowVolumeWindow] = useState<boolean>(false);
  const [previousVolume, setPreviousVolume] = useState<number>(volume);

  return (
    <ClickAwayListener onClickAway={() => setShowVolumeWindow(false)}>
      <div className={styles.container}>
        <Tooltip
          leaveDelay={1000}
          placement={'top'}
          classes={{
            tooltip: styles.tooltip,
          }}
          onOpen={() => setShowVolumeWindow(true)}
          onClose={() => setShowVolumeWindow(false)}
          open={showVolumeWindow}
          PopperProps={{ container: document.getElementById('full-screen-tooltips-container') }}
          title={
            <div className={styles.volumeSliderWrapper}>
              <Slider
                classes={{ thumb: styles.thumb }}
                orientation="vertical"
                value={volume}
                onChange={(e, value: number) => {
                  setVolume(value);
                }}
                min={0}
                step={0.01}
                max={1}
              />
            </div>
          }
        >
          <div
            onClick={() => {
              if (volume > 0) {
                setPreviousVolume(volume);
                setVolume(0);
                return;
              }
              setVolume(previousVolume);
            }}
          >
            {volume === 0 ? <VolumeMute /> : volume < 0.5 ? <VolumeHalf /> : <Volume />}
          </div>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default observer(ChangeVolumeButton);
