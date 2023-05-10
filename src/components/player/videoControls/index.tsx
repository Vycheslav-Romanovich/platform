import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip, Typography } from '@mui/material';
import { observer } from 'mobx-react';

import CloseFullscreen from '/src/assets/icons/video_controls/closeFullScreen.svg';
import FullScreen from '~/assets/icons/video_controls/fullScreenVideo.svg';
import NoSubtitle from '~/assets/icons/video_controls/noSubtitleIcon.svg';
import Pause from '~/assets/icons/video_controls/pause.svg';
import Play from '~/assets/icons/video_controls/play.svg';
import Subtitle from '~/assets/icons/video_controls/subtitleIcon.svg';

import Seek from './seek';

import styles from './videoControls.module.scss';

import ChangeVolumeButton from '~/components/player/videoControls/changeVolume';
import VideoSettingButton from '~/components/player/videoControls/videoSetting';
import { secondToHms } from '~/helpers/secondToHm';
import { mainStore, subtitlesStore, videoStore } from '~/stores';

type Props = {
  games: boolean;
  interval?: number[];
  toggleFullScreen: () => void;
  isPlatformIos?: boolean;
};

export default observer(function VideoControls({
  games,
  interval,
  toggleFullScreen,
  isPlatformIos = false,
}: Props) {
  const [showDisableTooltip, setShowDisableTooltip] = useState<boolean>(false);
  const [prevSubtitleMode, setPrevSubtitleMode] = useState(subtitlesStore.subtitleMode);
  const { t } = useTranslation();

  useEffect(() => {
    if (
      subtitlesStore.getTranslationClickedTimes &&
      subtitlesStore.getTranslationClickedTimes >= 4
    ) {
      subtitlesStore.setGetTranslationClickedTimes(null);
    }
  }, [subtitlesStore.getTranslationClickedTimes]);

  const handleClickSubtitleMode = () => {
    setPrevSubtitleMode(subtitlesStore.subtitleMode);
    subtitlesStore.subtitleMode === 'Off'
      ? subtitlesStore.setSubtitleMode(prevSubtitleMode)
      : subtitlesStore.setSubtitleMode('Off');
  };

  function intervalFlag(interval: number[]) {
    return videoStore.state.time - (interval !== undefined ? interval[0] : 0);
  }

  function intervalFlagTwo(interval: number[]) {
    return interval ? interval[1] - interval[0] : videoStore.state.duration;
  }

  return !games ? (
    <div className={styles.controls}>
      {mainStore.isWeb && (
        <div className={`${styles.controls_btn}`} onClick={videoStore.togglePause}>
          {videoStore.state.isPause ? (
            <Play
              styles={{
                height: '26px',
                width: '20px',
              }}
            />
          ) : (
            <Pause />
          )}
        </div>
      )}
      <div className={styles.time}>
        <div className={styles.timeCurrent}>{secondToHms(intervalFlag(interval))}</div>
        <div className={styles.timeSlash}> /</div>
        <div className={styles.timeDuration}>{secondToHms(intervalFlagTwo(interval))}</div>
      </div>
      <Seek
        value={intervalFlag(interval)}
        loaded={videoStore.state.loaded}
        duration={interval ? interval[1] - interval[0] : videoStore.state.duration}
        setValue={videoStore.setTime}
        setSeeking={(e) => videoStore.setSeeking(e)}
        start={interval ? interval[0] : null}
      />
      {!mainStore.isMobile && <ChangeVolumeButton />}
      {subtitlesStore.isExist ? (
        <div className={styles.subtitleIcon} onClick={handleClickSubtitleMode}>
          <Subtitle />
          {subtitlesStore.subtitleMode !== 'Off' && <div className={styles.subtitleLine} />}
        </div>
      ) : (
        <Tooltip
          classes={{ tooltip: styles.disableTooltip, arrow: styles.tooltipArrow }}
          arrow={true}
          onOpen={() => setShowDisableTooltip(true)}
          onClose={() => setShowDisableTooltip(false)}
          open={showDisableTooltip}
          title={
            <Typography variant={'body2'} color={'var(--White)'}>
              {t('playerSettings.noSubs')}
            </Typography>
          }
          placement={'top'}
        >
          <span>
            <div className={styles.subtitleIcon}>
              <NoSubtitle />
            </div>
          </span>
        </Tooltip>
      )}
      <VideoSettingButton />
      {!isPlatformIos && (
        <div className={styles.fullscreen} onClick={toggleFullScreen}>
          {videoStore.isFullScreen ? <CloseFullscreen /> : <FullScreen />}
        </div>
      )}
    </div>
  ) : (
    <Seek
      value={videoStore.state.time}
      loaded={videoStore.state.loaded}
      duration={videoStore.state.duration}
      setValue={videoStore.setTime}
      setSeeking={(e) => videoStore.setSeeking(e)}
      games={games}
    />
  );
});
