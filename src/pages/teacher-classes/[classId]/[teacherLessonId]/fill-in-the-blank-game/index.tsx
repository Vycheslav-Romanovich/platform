import React, { useEffect, useRef, useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react';
import { NextSeo } from 'next-seo';

import styles from './fillInTheBlankGame.module.scss';

import OtherExercises from '~/components/otherExercises';
import { FinishGame } from '~/games/fillTheBlank/finishGame';
import GameHeader from '~/games/fillTheBlank/gameHeader/gameHeader';
import GamePage from '~/games/fillTheBlank/gamePage/gamePage';
import LeavingGamePage from '~/games/matchingPairs/leavingGamePage/leavingGamePage';
import NavigationBarInGame from '~/games/matchingPairs/navigationBarInGame/navigationBarInGame';
import { sendEvent } from '~/helpers/sendToGtm';
import Layout from '~/hocs/layout';
import { fillInTheBlankGameStore, lessonStore } from '~/stores';

const FillInTheBlankGame = () => {
  const {
    tasksForCurrentRound,
    currentIndex,
    currentStepInRound,
    page,
    fetchTasks,
    setTasksForRound,
    setPage,
    rounds,
    currentRound,
    wordsInCurrentRound,
    lessonName,
    videoUrl,
    rebootAll,
    startAgain,
  } = fillInTheBlankGameStore;
  const [showModal, setShowModal] = useState<boolean>(false);
  const isItFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (lessonStore.isLoadingLessons === 'false') {
      fetchTasks();
      setTasksForRound();
    }

    return () => {
      rebootAll();
    };
  }, [lessonStore.isLoadingLessons]);

  useEffect(() => {
    setTasksForRound();
  }, [currentRound]);

  useEffect(() => {
    if (isItFirstRender.current === true) {
      isItFirstRender.current = false;
      return;
    }
    let timer;
    if (wordsInCurrentRound === 0 || currentStepInRound === wordsInCurrentRound) {
      timer = setTimeout(() => {
        setPage('finish');
        sendEvent('fill_in_blank_complete');
      }, 1200);
    }

    return () => clearTimeout(timer);
  }, [currentStepInRound, wordsInCurrentRound]);

  const onNextExerciseClick = () => {
    setShowModal(true);
  };

  const onStartAgainClick = () => {
    setPage('game');
    startAgain();
  };

  return (
    <>
      <NextSeo title="Fill in the blank" />
      <Layout
        classNameHeaderWrapper={styles.hideHeaderMobile}
        className={styles.backgroundAdaptiveMobile}
      >
        <NavigationBarInGame
          lessonName={lessonName}
          callback={() => setPage('leave')}
          gameName={'Fill in the Blank'}
        />
        <div className={styles.wrapper}>
          <div className={styles.gameSelect}>
            {page === 'finish' && (
              <FinishGame
                onNextExerciseClick={onNextExerciseClick}
                onStartAgainClick={onStartAgainClick}
              />
            )}
            {page === 'game' && (
              <div className={styles.gameWrapper}>
                <div className={styles.headerWrapper}>
                  <GameHeader
                    rounds={rounds}
                    currentRound={currentRound}
                    stepINRound={currentStepInRound}
                    wordsInRound={wordsInCurrentRound}
                  />
                  <div className={styles.adaptiveBtn}>
                    <IconButton onClick={() => setPage('leave')}>
                      <CloseRoundedIcon style={{ height: 24 }} />
                    </IconButton>
                  </div>
                </div>
                <GamePage
                  videoUrl={videoUrl}
                  interval={tasksForCurrentRound[currentIndex]?.videoStamps}
                  sentence={tasksForCurrentRound[currentIndex]?.sentence}
                  missingWord={tasksForCurrentRound[currentIndex]?.correctAnswer}
                  variants={tasksForCurrentRound[currentIndex]?.variants}
                />
              </div>
            )}

            {page === 'leave' && (
              <>
                <LeavingGamePage
                  gameWasLoaded={true}
                  isTeacherClass
                  onNoClick={() => setPage('game')}
                />
              </>
            )}
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
      </Layout>
    </>
  );
};

export default observer(FillInTheBlankGame);
