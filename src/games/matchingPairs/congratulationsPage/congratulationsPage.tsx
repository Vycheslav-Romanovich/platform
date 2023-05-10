import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import Logo from '~/assets/images/GameMatchingPairs.svg';

import s from '~/games/matchingPairs/congratulationsPage/congratulationsPage.module.scss';

import { lessonStore, matchingPairsGameStore, teacherClassesStore } from '~/stores';
import { WordsForGame } from '~/stores/MatchingPairsGameStore';

interface CongratsPage {
  words: WordsForGame[];
  roundTime: number;
  gameTime: number;
  rounds: number;
  currentRound: number;
  onStartAgainClick: () => void;
  onNextRoundClick: () => void;
  onNextExerciseClick: () => void;
}

const CongratulationPage: React.FC<CongratsPage> = ({
  words,
  roundTime,
  gameTime,
  onNextRoundClick,
  onNextExerciseClick,
  onStartAgainClick,
  rounds,
  currentRound,
}) => {
  const { countAnswer } = matchingPairsGameStore;
  const { asPath, query } = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const path = asPath.split('/')[4];
    if (path === 'matching-pairs' && +query.classId > 0 && +query.teacherLessonId > 0) {
      teacherClassesStore.updateStatisticsEdu({
        ...lessonStore.allLessonActivities,
        teacherLessonId: +query.teacherLessonId,
        classId: +query.classId,
        matchingPairs: Math.floor(
          (matchingPairsGameStore.matchedWords.length / 2 / lessonStore.lessonData.word.length) *
            100
        ),
      });
    }
  }, [asPath]);

  return (
    <div className={s.youWon}>
      <div className={s.confettiWrapper}>{currentRound === rounds ? <Confetti /> : null}</div>
      <div className={s.logo}>
        <Logo />
      </div>
      <div className={s.block}>
        <div className={s.titleProgress}>{t('games.finish.titleProgress')}</div>
        {!(currentRound === rounds) ? (
          <div className={s.congratulationsTitle}>{t('games.finish.great')}</div>
        ) : (
          <div className={s.congratulationsTitle}>{t('games.finish.exerciseComplete')}</div>
        )}
      </div>
      <>
        <div className={s.wordsLearnedWrapper}>
          <div className={s.dataOfGamesTerms}>
            <div>{t('games.finish.terms')}</div>
            {!(currentRound === rounds) ? (
              <div>{`${countAnswer} / ${words?.length}`}</div>
            ) : (
              <div>{`${words?.length} / ${words?.length}`}</div>
            )}
          </div>
          {roundTime && (
            <div className={s.dataOfGamesTime}>
              <div>{t('games.finish.time')}</div>
              {!(currentRound === rounds) ? (
                <div>{roundTime.toFixed(1) + ' ' + t('games.finish.sec')}</div>
              ) : (
                <div>{gameTime.toFixed(1) + ' ' + t('games.finish.sec')}</div>
              )}
            </div>
          )}
          <div className={s.dataOfGamesExercise}>
            <div>{t('games.finish.exerciseProgress')}</div>
            {!(currentRound === rounds) ? (
              <div>
                {Math.floor((countAnswer / words.length) * 100)}% {t('games.finish.complete')}
              </div>
            ) : (
              <div>{t('games.finish.complete100')}</div>
            )}
          </div>
        </div>
      </>

      <div className={s.buttonsBlock}>
        {currentRound === rounds ? (
          <>
            <Button variant="outlined" size="large" onClick={onStartAgainClick}>
              {t('games.finish.startAgain')}
            </Button>
            <Button variant="contained" onClick={onNextExerciseClick} size="large">
              {t('games.finish.nextExercise')}
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={onNextRoundClick} size="large">
            {t('games.finish.continue')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default observer(CongratulationPage);
