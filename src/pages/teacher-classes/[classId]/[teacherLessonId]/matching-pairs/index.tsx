import React, { useEffect, useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import styles from './matchingPairsGame.module.scss';

import OtherExercises from '~/components/otherExercises';
import CongratulationPage from '~/games/matchingPairs/congratulationsPage/congratulationsPage';
import GameHeader from '~/games/matchingPairs/gameHeader/gameHeader';
import GamePage from '~/games/matchingPairs/gamePage/gamePage';
import LeavingGamePage from '~/games/matchingPairs/leavingGamePage/leavingGamePage';
import NavBarInGame from '~/games/matchingPairs/navigationBarInGame/navigationBarInGame';
import { sendEvent } from '~/helpers/sendToGtm';
import Layout from '~/hocs/layout';
import { lessonStore, mainStore, matchingPairsGameStore } from '~/stores';
import { wordData } from '~/stores/MatchingPairsGameStore';

const MatchingPairsGamePage = () => {
  const {
    words,
    matchedWords,
    shuffledArray,
    currentRound,
    clicks,
    step,
    rounds,
    gameWasLoaded,
    lessonName,
    roundTime,
    gameTime,
    startAgainTrigger,
    size,
    mobileBlockPairsAmount,
    desktopBlockPairsAmount,
    fetchWords,
    setWordsForGame,
    deleteMatchedWords,
    resetIncorrectChoices,
    setSelectedFirstWord,
    setSelectedSecondWord,
    setRoundTime,
    rebootSettings,
    startAgain,
  } = matchingPairsGameStore;

  const router = useRouter();
  const { lessonId } = router.query;
  const [page, setPage] = useState<string>('game');
  const [numberPairWords, setNumberPairWords] = useState<number>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const youWon = matchedWords.length !== 0 && matchedWords.length === shuffledArray.length;

  const onClickForWord = (word: wordData) => {
    switch (step) {
      case 1:
        return setSelectedFirstWord(word);
      case 2:
        return setSelectedSecondWord(word);
    }
  };

  useEffect(() => {
    if (mainStore.isMobile) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  const onNextExerciseClick = () => {
    setShowModal(true);
  };

  useEffect(() => {
    if (lessonStore.isLoadingLessons === 'false') {
      setNumberPairWords(mainStore.isMobile ? mobileBlockPairsAmount : desktopBlockPairsAmount);
      fetchWords(+lessonId, numberPairWords);
    }

    return () => {
      startAgain();
    };
  }, [lessonStore.isLoadingLessons]);

  useEffect(() => {
    setWordsForGame(numberPairWords);
  }, [currentRound, numberPairWords, startAgainTrigger]);

  useEffect(() => {
    if (
      matchingPairsGameStore.gameWasLoaded &&
      matchingPairsGameStore.matchedWords.length !== 0 &&
      matchingPairsGameStore.matchedWords.length === matchingPairsGameStore.shuffledArray.length &&
      page !== 'leave'
    ) {
      sendEvent('matching_complete', { time: `${matchingPairsGameStore.roundTime}` });

      matchingPairsGameStore.setGameTime(
        +matchingPairsGameStore.roundTime.toString().split('.')[0],
        matchingPairsGameStore.roundTime.toString().split('.')[1]
          ? +matchingPairsGameStore.roundTime.toString().split('.')[1]
          : 0
      );
      matchingPairsGameStore.setCountAnswer(matchingPairsGameStore.matchedWords.length / 2);
    }
  }, [
    page,
    matchingPairsGameStore.gameWasLoaded,
    matchingPairsGameStore.matchedWords.length,
    matchingPairsGameStore.shuffledArray.length,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => deleteMatchedWords(), 500);

    return () => {
      clearTimeout(timer);
    };
  }, [clicks]);

  useEffect(() => {
    const timer = setTimeout(() => resetIncorrectChoices(), 500);

    return () => {
      clearTimeout(timer);
    };
  }, [clicks]);

  return (
    <>
      <NextSeo title="Matching pairs" />

      <Layout
        classNameHeaderWrapper={styles.hideHeaderMobile}
        className={styles.backgroundAdaptiveMobile}
      >
        {lessonStore.isLoadingLessons === 'false' && (
          <>
            <NavBarInGame lessonName={lessonName} callback={() => setPage('leave')} />

            <div className={styles.wrapper}>
              <div
                className={page === 'game' && !youWon ? styles.gameSelect : styles.gameSelectCenter}
              >
                <div className={styles.adaptiveBtn}>
                  <IconButton onClick={() => setPage('leave')}>
                    <CloseRoundedIcon style={{ height: 24 }} />
                  </IconButton>
                </div>

                <div className={styles.contentWrapper}>
                  {gameWasLoaded && page === 'leave' && (
                    <LeavingGamePage
                      isTeacherClass
                      gameWasLoaded={gameWasLoaded}
                      onNoClick={() => setPage('game')}
                    />
                  )}

                  {gameWasLoaded && !youWon && page === 'game' && (
                    <div className={styles.gameWrapper}>
                      <GameHeader
                        page={page}
                        gameWasLoaded={gameWasLoaded}
                        callback={setRoundTime}
                        youWon={youWon}
                        rounds={rounds}
                        currentRound={currentRound}
                      />
                      <GamePage
                        size={size}
                        arrayForRender={shuffledArray}
                        onClickForWord={onClickForWord}
                      />
                    </div>
                  )}

                  {gameWasLoaded && youWon && page !== 'leave' && (
                    <CongratulationPage
                      words={words}
                      onNextExerciseClick={onNextExerciseClick}
                      onNextRoundClick={rebootSettings}
                      onStartAgainClick={startAgain}
                      roundTime={roundTime}
                      gameTime={gameTime}
                      rounds={rounds}
                      currentRound={currentRound}
                    />
                  )}
                </div>
              </div>

              <div className={styles.contentContainer}>
                <div className={styles.otherExercisesWrapper}>
                  <OtherExercises
                    isTeacherClasses
                    showModal={showModal}
                    changeShowModal={setShowModal}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default observer(MatchingPairsGamePage);
