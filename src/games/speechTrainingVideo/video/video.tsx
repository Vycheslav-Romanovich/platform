import React, { FC, useEffect } from 'react';

import Player from '~/components/player';
import { fillInTheBlankGameStore, videoStore } from '~/stores';

interface Props {
  videoUrl: string;
  interval: number[];
}

const Video: FC<Props> = ({ videoUrl, interval }) => {
  const { currentStepInRound, wordsInCurrentRound, currentIndex } = fillInTheBlankGameStore;
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
  }, [currentStepInRound, wordsInCurrentRound, currentIndex]);

  return (
    <Player
      id={videoUrl}
      interval={interval}
      togglePlayCont={true}
      withSubtitles={false}
      noActivity={true}
    />
  );
};

export default Video;
