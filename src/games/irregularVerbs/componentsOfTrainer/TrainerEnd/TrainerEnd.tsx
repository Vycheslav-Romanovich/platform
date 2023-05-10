import React, { FC } from 'react';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

import Close from '~/assets/icons/close.svg';

import style from './TrainerEnd.module.scss';

type PropsTrainerEndType = {
  logo: any;
  count: number;
  setPage: (str: string) => void;
  url: string;
  time?: number;
};
export const TrainerEnd: FC<PropsTrainerEndType> = ({ logo, count, setPage, url, time }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const nextExercise = () => {
    router.push(url);
  };

  return (
    <>
      <div className={style.confetti}>
        <Confetti width={912} />
      </div>
      <div className={style.main}>
        <div className={style.back} onClick={() => setPage('leave')}>
          <Close />
        </div>
        <div className={style.logo}>{logo}</div>
        <div className={style.block}>
          <div className={style.titleProgress}>{t('games.finish.titleProgress')}</div>
          <div className={style.congratulationsTitle}>{t('games.finish.exerciseComplete')}</div>
        </div>
        <div className={style.wordsLearnedWrapper}>
          <div className={style.dataOfGamesTerms}>
            <div>{t('games.finish.terms')}</div>
            <div>{`${count} / ${count}`}</div>
          </div>
          {time && (
            <div className={style.dataOfGamesTime}>
              <div>{t('games.finish.time')}</div>
              <div>{`${time} sec`}</div>
            </div>
          )}
          <div className={style.dataOfGamesExercise}>
            <div>{t('games.finish.exerciseProgress')}</div>
            <div>{t('games.finish.complete100')}</div>
          </div>
        </div>

        <div className={style.endingGameButtonsWrapper}>
          <Button onClick={() => setPage('trainer')} variant="outlined" size="large">
            {t('games.finish.startAgain')}
          </Button>

          <Button onClick={nextExercise} variant="contained" size="large">
            {t('games.finish.nextExercise')}
          </Button>
        </div>
      </div>
    </>
  );
};
