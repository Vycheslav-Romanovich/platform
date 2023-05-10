import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import Logo from '~/assets/images/GameSpeechTraining.svg';

import styles from './finishGame.module.scss';

import { fillInTheBlankGameStore, lessonStore, teacherClassesStore, variantStore } from '~/stores';

interface Props {
  showModal: () => void;
}

export const FinishGame = observer(({ showModal }: Props) => {
  const {
    currentRound,
    rounds,
    currentIndexQuestion,
    skipWord,
    wordsData,
    setCurrentRound,
    resetQuestionCounter,
    setPage,
  } = variantStore;
  const { startAgain, rebootAll, nextRound, setTasksForRound } = fillInTheBlankGameStore;
  const { asPath, query } = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const path = asPath.split('/')[4];
    if (path === 'speech-training-video' && +query.classId > 0 && +query.teacherLessonId > 0) {
      teacherClassesStore.updateStatisticsEdu({
        ...lessonStore.allLessonActivities,
        teacherLessonId: +query.teacherLessonId,
        classId: +query.classId,
        speechTraining: Math.floor(((currentIndexQuestion - skipWord) / wordsData.length) * 100),
      });
    }
  }, [asPath]);

  const startAgainPage = () => {
    startAgain();
    setPage('game');
    setCurrentRound(1);
    resetQuestionCounter();
    rebootAll();
  };

  const nextRoundPage = () => {
    nextRound();
    setTasksForRound();
    setCurrentRound(currentRound + 1);
    setPage('game');
  };

  return (
    <>
      <div className={styles.confettiWrapper}>{currentRound === rounds ? <Confetti /> : null}</div>

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
            <div>{`${currentIndexQuestion - skipWord} / ${wordsData.length}`}</div>
          </div>
          <div className={styles.dataOfGamesExercise}>
            <div>{t('games.finish.exerciseProgress')}</div>
            <div>
              {Math.floor(((currentIndexQuestion - skipWord) / wordsData.length) * 100)}%{' '}
              {t('games.finish.complete')}
            </div>
          </div>
        </div>

        <div className={styles.endingGameButtonsWrapper}>
          {currentRound === rounds ? (
            <>
              <Button onClick={startAgainPage} variant="outlined" size="large">
                {t('games.finish.startAgain')}
              </Button>
              <Button onClick={showModal} variant="contained" size="large">
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
