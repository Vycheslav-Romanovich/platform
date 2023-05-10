import React from 'react';
import { useTranslation } from 'react-i18next';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Typography } from '@mui/material';
import { observer } from 'mobx-react';

import ChangeSpeed from '~/assets/icons/video_controls/changeSpeed.svg';
import Subtitle from '~/assets/icons/video_controls/subtitleIcon.svg';

import styles from '~/components/player/videoControls/videoSetting/popoverSettingContent/popoverSettingContent.module.scss';

import { supportedLanguages } from '~/constants/supportedLanguages';
import { settingsStore, subtitlesStore, userStore, videoStore } from '~/stores';

const PopoverSettingContent: React.FC = () => {
  const { t } = useTranslation();
  const { speed } = videoStore.state;
  const { setModeSetting } = settingsStore;
  const { subtitleMode, isExist } = subtitlesStore;
  const nativeLanguage = supportedLanguages.find((f) => f.code === userStore?.user?.from)?.name;
  const translateLanguage = supportedLanguages.find((f) => f.code === userStore?.user?.to)?.name;

  return (
    <div>
      <div className={styles.settingsBlock} onClick={() => setModeSetting('speed')}>
        <div className={styles.titleContainer}>
          <ChangeSpeed />
          <Typography sx={{ color: 'var(--White)' }} variant="body1" className={styles.title}>
            {t('playerSettings.speed')}
          </Typography>
        </div>
        <div className={styles.settingContent}>
          <Typography sx={{ color: 'var(--White)' }} variant={'body2'}>
            {speed === 1 ? t('playerSettings.normal') : speed}
          </Typography>
          <ArrowForwardIosIcon sx={{ width: '20px' }} />
        </div>
      </div>
      <div className={styles.settingsBlock} onClick={() => isExist && setModeSetting('subtitle')}>
        <div className={styles.titleContainer}>
          <Subtitle />
          <Typography sx={{ color: 'var(--White)' }} variant="body1" className={styles.title}>
            {t('playerSettings.subtitles')}
          </Typography>
        </div>
        <div className={styles.settingContent}>
          {isExist ? (
            <Typography sx={{ color: 'var(--White)' }} variant={'body2'}>
              {subtitleMode === 'to'
                ? translateLanguage
                : subtitleMode === 'from'
                ? nativeLanguage
                : subtitleMode}{' '}
            </Typography>
          ) : (
            <Typography sx={{ color: 'var(--White)', paddingRight: '18px' }} variant={'body2'}>
              {t('playerSettings.noSubs')}
            </Typography>
          )}
          {isExist && <ArrowForwardIosIcon sx={{ width: '20px' }} />}
        </div>
      </div>
    </div>
  );
};

export default observer(PopoverSettingContent);
