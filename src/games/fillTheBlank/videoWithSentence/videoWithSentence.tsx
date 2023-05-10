import React, { FC, useEffect } from 'react';
import { Typography } from '@mui/material';

import styles from '~/games/fillTheBlank/videoWithSentence/videoWithSentence.module.scss';

import Player from '~/components/player';
import { fillInTheBlankGameStore, videoStore } from '~/stores';

interface Props {
  videoUrl: string;
  interval: number[];
  sentence: string;
  missingWord: string;
}

const VideoWithSentence: FC<Props> = ({ videoUrl, interval, sentence, missingWord }) => {
  const { correctChoices, currentStepInRound, wordsInCurrentRound } = fillInTheBlankGameStore;
  const { setPause } = videoStore;

  useEffect(() => {
    if (currentStepInRound === wordsInCurrentRound) {
      return;
    }
    const timer = setTimeout(() => {
      setPause(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [currentStepInRound, wordsInCurrentRound]);

  return (
    <div className={styles.sentence}>
      <div className={styles.blockWrapper}>
        <div className={styles.playerContainer}>
          <Player
            noActivity
            id={videoUrl}
            interval={interval}
            togglePlayCont={true}
            withSubtitles={false}
          />
        </div>
      </div>
      <Typography variant="game" className={styles.textContent}>
        {sentence?.split(missingWord)[0]}
        <span
          className={correctChoices.length !== 0 ? styles.missingWordSolved : styles.missingWord}
        >
          {missingWord}
        </span>
        {sentence?.split(missingWord)[1]}
      </Typography>
    </div>
  );
};

export default VideoWithSentence;
