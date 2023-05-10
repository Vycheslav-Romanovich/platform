import React from 'react';
import { useTranslation } from 'react-i18next';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckIcon from '@mui/icons-material/Check';
import { Typography } from '@mui/material';
import { observer } from 'mobx-react';

import styles from '~/components/player/videoControls/videoSetting/popoverInnerContent/popoverInnerContent.module.scss';

import { speedVariants } from '~/constants/videoSetting';
import { settingsStore, videoStore } from '~/stores';

const PopoverInnerContent = () => {
  const { t } = useTranslation();
  const { setSpeed } = videoStore;
  const { speed } = videoStore.state;
  const { setModeSetting } = settingsStore;

  function clickHandler(speedChange: typeof speed) {
    setSpeed(speedChange);
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
          {t('playerSettings.speed')}
        </Typography>
      </div>
      {speedVariants.map((speedVariant, index) => {
        return (
          <div key={index} onClick={() => clickHandler(speedVariant)}>
            <Typography variant="body2" className={styles.typography}>
              <CheckIcon
                className={
                  speed === speedVariant ? styles.checkIconActive : styles.checkIconNotActive
                }
              />
              {speedVariant === 1 ? t('playerSettings.normal') : speedVariant}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

export default observer(PopoverInnerContent);
