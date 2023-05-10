import React, { memo, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import styles from './finishExercise.module.scss';

import { lessonStore, teacherClassesStore, videoStore } from '~/stores';

interface Props {
  title: string;
  congratulationTitle: string;
  doneExercise: number;
  donePercent: number;
  allExercise: number;
}

const FinishExercise: React.FC<Props> = ({
  congratulationTitle,
  doneExercise,
  donePercent,
  title,
  allExercise,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const { pathname } = window.location;
    const paths = pathname.substring(pathname.indexOf('/teacher-classes/') + 17).split('/');
    const classIdPath = +paths[0];
    const teacherLessonIdPath = +paths[1];

    teacherClassesStore.updateStatisticsEdu({
      ...lessonStore.allLessonActivities,
      teacherLessonId: teacherLessonIdPath,
      classId: classIdPath,
      videoGame: donePercent,
    });
  }, []);

  return (
    <>
      <div onClick={(e) => e.stopPropagation()} className={styles.background} />
      <div
        className={styles.main}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
      >
        <div className={styles.confettiWrapper}>
          <Confetti />
        </div>
        <div className={styles.block}>
          <div className={styles.titleProgress}>{title}</div>
          <div className={styles.congratulationsTitle}>{congratulationTitle}</div>
        </div>
        <div className={styles.wordsLearnedWrapper}>
          <div className={styles.dataOfGamesTerms}>
            <div>{t('games.finish.activitiesCompleted')}</div>
            <div>{`${doneExercise} / ${allExercise}`}</div>
          </div>
          <div className={styles.dataOfGamesExercise}>
            <div>{t('games.finish.exerciseProgress')}</div>
            <div>
              {doneExercise ? Math.floor(donePercent) : '0'}
              {t('games.finish.correct')}
            </div>
          </div>
        </div>

        <div className={styles.endingGameButtonsWrapper}>
          <Button
            onClick={() => {
              videoStore.setOpenEndVideoModal(false);
            }}
            variant="outlined"
            size="large"
          >
            {t('games.finish.startAgain')}
          </Button>
          <Button
            onClick={() => {
              videoStore.setOpenEndVideoModal(false);
              videoStore.setOpenVideoModal(false);
            }}
            variant="contained"
            size="large"
          >
            {t('lessons.done')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default memo(FinishExercise);
