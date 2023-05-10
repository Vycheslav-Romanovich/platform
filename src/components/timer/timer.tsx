import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import s from './timer.module.scss';

interface Timer {
  gameIsLoaded: boolean;
  callback: (minutes: number, seconds: number, milliseconds: number) => void;
}

const Timer = (props: Timer) => {
  const { t } = useTranslation();
  const [milliseconds, setMilliseconds] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  useEffect(() => {
    let interval = null;
    if (props.gameIsLoaded) {
      interval = setInterval(() => {
        setMilliseconds((milliseconds) => milliseconds + 1);
      }, 100);
    }

    return () => {
      clearInterval(interval);
      props.callback(minutes, seconds, milliseconds);
    };
  }, [milliseconds]);

  const returnTime = () => {
    if (milliseconds === 9) {
      setSeconds(seconds + 1);
      setMilliseconds(0);
    }
    if (seconds === 60) {
      setMinutes(minutes + 1);
      setSeconds(0);
    }

    return `${minutes < 10 ? `0${minutes}` : minutes} : ${
      seconds === 60 ? '00' : seconds < 10 ? `0${seconds}` : seconds
    }`;
  };

  return (
    <div className={s.contentWrapper}>
      {t('games.finish.time')}
      <div className={s.timerContainer}>{returnTime()}</div>
    </div>
  );
};

export default observer(Timer);
