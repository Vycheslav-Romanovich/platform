import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import Logo from '~/assets/images/GameFillwords.svg';

import styles from './finishGame.module.scss';

import { fillWordStore, lessonStore, teacherClassesStore } from '~/stores';

interface Props {
  onNextExerciseClick: () => void;
}

export const FinishGame = observer(({ onNextExerciseClick }: Props) => {
  const {
    countRound,
    round,
    countWordReadyGame,
    wordsCount,
    resetWord,
    setCurrentCountAnswer,
    setPage,
    setRound,
    valueChange,
    setHintWordId,
  } = fillWordStore;

  const { t } = useTranslation();

  const { asPath, query } = useRouter();

  const startAgain = () => {
    if (round === countRound) {
      resetWord();
      setRound(1);
    }
    setCurrentCountAnswer(0);
    valueChange();
    setPage('game');
  };

  const nextRound = () => {
    setHintWordId(0);
    setCurrentCountAnswer(0);
    setRound(round + 1);
    setPage('game');
  };

  useEffect(() => {
    const path = asPath.split('/')[4];
    if (path === 'fillwords' && +query.classId > 0 && +query.teacherLessonId > 0) {
      teacherClassesStore.updateStatisticsEdu({
        ...lessonStore.allLessonActivities,
        teacherLessonId: +query.teacherLessonId,
        classId: +query.classId,
        fillWords: Math.floor((wordsCount / lessonStore.lessonData.word.length) * 100),
      });
    }
  }, [asPath]);

  return (
    <div className={styles.finishWrapper}>
      <div className={styles.confettiWrapper}>{round === countRound ? <Confetti /> : null}</div>

      <div className={styles.main}>
        <div className={styles.back} onClick={() => setPage('leave')}>
          <CloseRoundedIcon style={{ height: 24 }} />
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles.block}>
          <div className={styles.titleProgress}>{t('games.finish.titleProgress')}</div>
          {!(round === countRound) ? (
            <div className={styles.congratulationsTitle}>{t('games.finish.great')}</div>
          ) : (
            <div className={styles.congratulationsTitle}>{t('games.finish.exerciseComplete')}</div>
          )}
        </div>
        <div className={styles.wordsLearnedWrapper}>
          <div className={styles.dataOfGamesTerms}>
            <div>{t('games.finish.terms')}</div>
            {!(round === countRound) ? (
              <div>{`${wordsCount} / ${countWordReadyGame}`}</div>
            ) : (
              <div>{`${countWordReadyGame} / ${countWordReadyGame}`}</div>
            )}
          </div>
          <div className={styles.dataOfGamesExercise}>
            <div>{t('games.finish.exerciseProgress')}</div>
            {!(round === countRound) ? (
              <div>
                {Math.floor((wordsCount / countWordReadyGame) * 100)}% {t('games.finish.complete')}
              </div>
            ) : (
              <div>{t('games.finish.complete100')}</div>
            )}
          </div>
        </div>

        <div className={styles.endingGameButtonsWrapper}>
          {round === countRound ? (
            <>
              <Button onClick={startAgain} variant="outlined" size="large">
                {t('games.finish.startAgain')}
              </Button>
              <Button onClick={onNextExerciseClick} variant="contained" size="large">
                {t('games.finish.nextExercise')}
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={nextRound} size="large">
              {t('games.finish.continue')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
