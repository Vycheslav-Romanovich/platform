import React, { useEffect } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react';

import SpeechText from '../speechText';

import styles from './game.module.scss';

import AdaptiveProgressBar from '~/components/adaptiveProgressBar/adaptiveProgressBar';
import NotSupported from '~/games/speechTraining/notSupported/notSupported';
import SkipButton from '~/games/speechTrainingVideo/skipButton/skipButton';
import { speechRecognition } from '~/helpers/speechRecognition';
import { fillInTheBlankGameStore, lessonStore, mainStore, variantStore } from '~/stores';

interface Props {
  onClick: () => void;
}

export const Game = observer(({ onClick }: Props) => {
  const { wordsData } = lessonStore;
  const { currentIndexQuestion, wordsInCurrentRound } = variantStore;
  const { tasksForCurrentRound, currentIndex, videoUrl } = fillInTheBlankGameStore;

  useEffect(() => {
    if (mainStore.isMobile) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  return (
    <>
      {currentIndexQuestion < wordsData.length ? (
        <>
          <div className={styles.container}>
            <AdaptiveProgressBar
              currentValue={currentIndex}
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
            <div className={styles.gameTable}>
              <SkipButton />
              <SpeechText
                videoUrl={videoUrl}
                sentence={tasksForCurrentRound[currentIndex]?.sentence}
                interval={tasksForCurrentRound[currentIndex]?.videoStamps}
                missingWord={tasksForCurrentRound[currentIndex]?.correctAnswer}
              />
            </div>
          )}
        </>
      ) : null}
    </>
  );
});
