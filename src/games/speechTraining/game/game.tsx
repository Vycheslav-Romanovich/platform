import React, { useEffect, useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react';

import { SpeechText } from '../speechText';

import styles from './game.module.scss';

import AdaptiveProgressBar from '~/components/adaptiveProgressBar/adaptiveProgressBar';
import NotSupported from '~/games/speechTraining/notSupported/notSupported';
import SkipButton from '~/games/speechTraining/skipButton/skipButton';
import { speechRecognition } from '~/helpers/speechRecognition';
import { lessonStore, mainStore, variantStore } from '~/stores';

interface Props {
  onClick: () => void;
}

export const Game = observer(({ onClick }: Props) => {
  const { wordsData } = lessonStore;
  const { currentIndexQuestion, wordsInCurrentRound } = variantStore;
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (mainStore.isMobile) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  useEffect(() => {
    if (step != currentIndexQuestion) {
      setStep(step + 1);
    }
  }, [currentIndexQuestion]);

  return (
    <>
      {currentIndexQuestion < wordsData.length ? (
        <>
          <div className={styles.container}>
            <AdaptiveProgressBar
              currentValue={step}
              maxLength={wordsInCurrentRound}
              isValue={true}
              step={0}
            />
            <div className={styles.adaptiveBtn}>
              <IconButton onClick={onClick}>
                <CloseRoundedIcon style={{ height: 24 }} />
              </IconButton>
            </div>
          </div>
          {speechRecognition('') == undefined ? (
            <div className={styles.notSupported}>
              <NotSupported />
            </div>
          ) : (
            <>
              <div className={styles.skipBtn}>
                <SkipButton />
              </div>
              <SpeechText />
            </>
          )}
        </>
      ) : null}
    </>
  );
});
