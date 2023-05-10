import React, { FC, ReactElement, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import styles from './finishGame.module.scss';

import { lessonStore, teacherClassesStore, variantStore } from '~/stores';

interface Props {
  onNextExerciseClick: () => void;
  onStartAgainClick: () => void;
  logo: ReactElement | null;
  skipWord: number;
}

export const FinishGame: FC<Props> = observer(
  ({ onNextExerciseClick, onStartAgainClick, logo, skipWord }) => {
    const {
      currentRound,
      rounds,
      currentIndexQuestion,
      wordsData,
      setCurrentRound,
      setCurrentStepInRound,
      setPage,
    } = variantStore;

    const nextRound = () => {
      setPage('game');
      setCurrentRound(currentRound + 1);
      setCurrentStepInRound(0);
    };

    const { t } = useTranslation();

    const { asPath, query } = useRouter();

    useEffect(() => {
      const path = asPath.split('/')[4];
      if (path === 'choose-the-variant' && +query.classId > 0 && +query.teacherLessonId > 0) {
        teacherClassesStore.updateStatisticsEdu({
          ...lessonStore.allLessonActivities,
          teacherLessonId: +query.teacherLessonId,
          classId: +query.classId,
          chooseVariant: Math.floor(((currentIndexQuestion - skipWord) / wordsData.length) * 100),
        });
      }
      if (path === 'speech-training' && +query.classId > 0 && +query.teacherLessonId > 0) {
        teacherClassesStore.updateStatisticsEdu({
          ...lessonStore.allLessonActivities,
          teacherLessonId: +query.teacherLessonId,
          classId: +query.classId,
          speechTraining: Math.floor(((currentIndexQuestion - skipWord) / wordsData.length) * 100),
        });
      }
    }, [asPath]);

    return (
      <>
        <div className={styles.confettiWrapper}>
          {currentRound === rounds ? <Confetti /> : null}
        </div>

        <div className={styles.main}>
          <div className={styles.back} onClick={() => setPage('leave')}>
            <CloseRoundedIcon style={{ height: 24 }} />
          </div>
          <div className={styles.logo}>{logo}</div>
          <div className={styles.block}>
            <div className={styles.titleProgress}>{t('games.finish.titleProgress')}</div>
            {!(currentRound === rounds) ? (
              <div className={styles.congratulationsTitle}>{t('games.finish.great')}</div>
            ) : (
              <div className={styles.congratulationsTitle}>
                {t('games.finish.exerciseComplete')}
              </div>
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
                <Button onClick={onStartAgainClick} variant="outlined" size="large">
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
      </>
    );
  }
);
