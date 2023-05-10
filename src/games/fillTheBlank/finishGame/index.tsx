import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import Logo from '~/assets/images/GameFillTheBlank.svg';

import styles from './finishGame.module.scss';

import { fillInTheBlankGameStore, lessonStore, teacherClassesStore } from '~/stores';

interface Props {
  onNextExerciseClick: () => void;
  onStartAgainClick: () => void;
}

export const FinishGame = observer(({ onNextExerciseClick, onStartAgainClick }: Props) => {
  const { currentRound, rounds, setPage, nextRound, countAnswer } = fillInTheBlankGameStore;

  const { t } = useTranslation();
  const nextRoundPage = () => {
    setPage('game');
    nextRound();
  };

  const { asPath, query } = useRouter();

  useEffect(() => {
    const path = asPath.split('/')[4];
    if (path === 'fill-in-the-blank-game' && +query.classId > 0 && +query.teacherLessonId > 0) {
      teacherClassesStore.updateStatisticsEdu({
        ...lessonStore.allLessonActivities,
        teacherLessonId: +query.teacherLessonId,
        classId: +query.classId,
        fillBlank: Math.floor((countAnswer / lessonStore.wordsData.length) * 100),
      });
    }
  }, [asPath]);

  return (
    <>
      {currentRound === rounds ? <Confetti style={{ width: '100%', height: '100%' }} /> : null}
      <div className={styles.main}>
        <div className={styles.back} onClick={() => setPage('leave')}>
          <CloseRoundedIcon style={{ height: 24 }} />
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles.block}>
          <div className={styles.titleProgress}>{t('games.finish.titleProgress')}</div>
          {!(currentRound === rounds) ? (
            <div className={styles.congratulationsTitle}>{t('games.finish.great')}</div>
          ) : (
            <div className={styles.congratulationsTitle}>{t('games.finish.exerciseComplete')}</div>
          )}
        </div>
        <div className={styles.wordsLearnedWrapper}>
          <div className={styles.dataOfGamesTerms}>
            <div>{t('games.finish.terms')}</div>
            <div>{`${countAnswer} / ${lessonStore.wordsData.length}`}</div>
          </div>
          <div className={styles.dataOfGamesExercise}>
            <div>{t('games.finish.exerciseProgress')}</div>
            <div>
              {Math.floor((countAnswer / lessonStore.wordsData.length) * 100)}%{' '}
              {t('games.finish.complete')}
            </div>
          </div>
        </div>

        <div className={styles.endingGameButtonsWrapper}>
          {currentRound === rounds ? (
            <>
              <Button onClick={onStartAgainClick} variant="outlined" size="large">
                {t('games.finish.startAgain')}
              </Button>
              <Button onClick={onNextExerciseClick} variant="contained" size="large">
                {t('games.finish.nextExercise')}
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={nextRoundPage} size="large">
              {t('games.finish.continue')}
            </Button>
          )}
        </div>
      </div>
    </>
  );
});
