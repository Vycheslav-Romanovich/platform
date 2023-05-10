import React from 'react';
import { Typography } from '@mui/material';
import { observer } from 'mobx-react';

import styles from './levelLanguage.module.scss';

import { sortByEnglishLevel } from '~/constants/sortLessons';
import { lessonStore } from '~/stores';

const LevelLanguage = () => {
  const level = sortByEnglishLevel.find(
    (lang) => lang.value === lessonStore.lessonData?.level
  )?.lable;

  return (
    <Typography variant="body1" className={styles.levelLanguage}>
      {level}
    </Typography>
  );
};

export default observer(LevelLanguage);
