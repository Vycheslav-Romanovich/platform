import React from 'react';
import { useTranslation } from 'react-i18next';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckIcon from '@mui/icons-material/Check';
import { Typography } from '@mui/material';
import { observer } from 'mobx-react';

import styles from '~/components/player/videoControls/videoSetting/popoverSubtitleContent/popoverSubtitleContent.module.scss';

import { supportedLanguages } from '~/constants/supportedLanguages';
import { lessonStore, settingsStore, subtitlesStore, userStore } from '~/stores';

const PopoverSubtitleContent = () => {
  const { t } = useTranslation();
  const { setSubtitleMode, subtitleMode } = subtitlesStore;
  const { setModeSetting } = settingsStore;
  const nativeLanguage = userStore.isAuth
    ? supportedLanguages.find((f) => f.code === userStore?.user?.from)?.name
    : supportedLanguages.find((f) => f.code === lessonStore?.lessonData?.from)?.name;
  const translateLanguage = userStore.isAuth
    ? supportedLanguages.find((f) => f.code === userStore?.user?.to)?.name
    : supportedLanguages.find((f) => f.code === lessonStore?.lessonData?.to)?.name;
  const subtitleVariants: Array<'from' | 'to' | 'Dual Subtitles' | 'Off'> = [
    'from',
    'to',
    'Dual Subtitles',
    'Off',
  ];

  function clickHandler(subtitleVariant: 'from' | 'to' | 'Dual Subtitles' | 'Off') {
    setSubtitleMode(subtitleVariant);
    setModeSetting('setting');
  }

  return (
    <div className={styles.chooseSpeedBlock}>
      <div className={styles.blockBack}>
        <ArrowBackIosNewIcon
          sx={{ color: 'var(--White)', width: '14px', cursor: 'pointer' }}
          onClick={() => setModeSetting('setting')}
        />
        <Typography variant="h6" className={styles.title}>
          {t('playerSettings.subtitles')}
        </Typography>
      </div>
      {subtitleVariants.map((subtitleVariant, index) => {
        return (
          <div key={index} onClick={() => clickHandler(subtitleVariant)}>
            <Typography variant="body2" className={styles.typography}>
              <CheckIcon
                className={
                  subtitleMode === subtitleVariant
                    ? styles.checkIconActive
                    : styles.checkIconNotActive
                }
              />
              {subtitleVariant === 'to'
                ? translateLanguage
                : subtitleVariant === 'from'
                ? nativeLanguage
                : subtitleVariant}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

export default observer(PopoverSubtitleContent);
