import React, { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';

import styles from '~/games/fillTheBlank/gamePage/gamePage.module.scss';

import SkipButton from '~/games/fillTheBlank/skipButton/skipButton';
import VideoWithSentence from '~/games/fillTheBlank/videoWithSentence/videoWithSentence';
import { fillInTheBlankGameStore, mainStore } from '~/stores';

interface Props {
  videoUrl: string;
  interval: number[];
  sentence: string;
  missingWord: string;
  variants: string[];
}

const GamePage: FC<Props> = ({ videoUrl, interval, sentence, missingWord, variants }) => {
  const {
    correctChoices,
    incorrectChoices,
    trigger,
    addToAlreadyLearned,
    addWordToShowAgain,
    addIncorrectChoice,
    addCorrectChoice,
    resetChoices,
    nextWord,
    nextStep,
  } = fillInTheBlankGameStore;

  const [clickIsAble, setClickIsAble] = useState<boolean>(true);
  const [correct, setCorrect] = useState<boolean>(false);
  const firstUpdate = useRef(true);

  const chooseDecoration = (word: string) => {
    if (incorrectChoices.includes(word)) {
      return styles.contentWrapperIncorrect;
    }
    if (correctChoices.includes(word)) {
      return styles.contentWrapperCorrect;
    }
    return styles.contentWrapper;
  };

  const compareWords = (word: string) => {
    if (!clickIsAble) {
      return;
    }
    if (word === missingWord) {
      addToAlreadyLearned();
      addCorrectChoice(word);
      setCorrect(true);
    } else {
      addWordToShowAgain();
      addIncorrectChoice(word);
      setCorrect(false);
    }
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    setClickIsAble(false);
    const timer = setTimeout(() => {
      if (correct) {
        nextStep();
      }
      resetChoices();
      nextWord();
      setClickIsAble(true);
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [trigger]);

  return (
    <div className={styles.gameTable}>
      {mainStore.isMobile ? null : <SkipButton />}
      <VideoWithSentence
        sentence={sentence}
        videoUrl={videoUrl}
        interval={interval}
        missingWord={missingWord}
      />
      <div className={styles.variantsWrapper}>
        {variants?.map((variant, index) => {
          return (
            <div
              key={index}
              className={chooseDecoration(variant)}
              onClick={() => compareWords(variant)}
            >
              {variant?.toLowerCase()}
            </div>
          );
        })}
      </div>
      {mainStore.isMobile ? <SkipButton /> : null}
    </div>
  );
};

export default observer(GamePage);
