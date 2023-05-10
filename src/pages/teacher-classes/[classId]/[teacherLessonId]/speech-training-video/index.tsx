import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { observer } from 'mobx-react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Arrow from '~/assets/icons/arrows/arrow.svg';

import styles from './speechTrainingVideo.module.scss';

import OtherExercises from '~/components/otherExercises';
import { FinishGame } from '~/games/speechTrainingVideo/finishGame';
import { Game } from '~/games/speechTrainingVideo/game/game';
import { LeavingGame } from '~/games/speechTrainingVideo/leavingGame';
import Layout from '~/hocs/layout';
import { fillInTheBlankGameStore, lessonStore, variantStore } from '~/stores';

const SpeechGame: NextPage = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    currentIndexQuestion,
    page,
    wordsData,
    resetQuestionCounter,
    resetDataChooseGame,
    setWordsInCurrentRound,
    setCurrentStepInRound,
    setPage,
    setWordsData,
  } = variantStore;
  const {
    fetchTasks,
    setTasksForRound,
    rounds,
    currentRound,
    wordsInCurrentRound,
    lessonName,
    rebootAll,
  } = fillInTheBlankGameStore;

  useEffect(() => {
    if (lessonStore.isLoadingLessons === 'false') {
      setWordsData();
      fetchTasks();
      setTasksForRound();
    }

    return () => {
      resetQuestionCounter();
      resetDataChooseGame();
      rebootAll();
    };
  }, [lessonStore.isLoadingLessons]);

  useEffect(() => {
    if (rounds === 1) {
      setWordsInCurrentRound(wordsData.length);
    } else {
      if (currentRound === rounds) {
        setWordsInCurrentRound(wordsData.length % 12);
      } else {
        setWordsInCurrentRound(12);
      }
    }

    return () => {
      setWordsInCurrentRound(0);
      setCurrentStepInRound(0);
    };
  }, [wordsInCurrentRound, currentRound]);

  useEffect(() => {
    if (wordsData.length && currentIndexQuestion >= wordsData.length) {
      setPage('finish');
    }
  }, [currentIndexQuestion, setPage, wordsData]);

  useEffect(() => {
    if (currentIndexQuestion !== 0 && currentIndexQuestion === 12 * currentRound) {
      setPage('finish');
    }
  }, [currentIndexQuestion]);

  return (
    <>
      <NextSeo title="Check pronunciation" />

      <Layout
        classNameHeaderWrapper={styles.hideHeaderMobile}
        className={styles.backgroundAdaptiveMobile}
        classNameContent={styles.layout}
      >
        {page === 'finish' && (
          <div className={styles.confettiWrapper}>
            <Confetti className={styles.confetti} />
          </div>
        )}
        <p className={styles.titleBlock}>
          <Arrow onClick={() => setPage('leave')} />
          <p>{`${lessonName} / Check pronunciation`}</p>
        </p>

        <div className={styles.wrapper}>
          <div className={styles.gameSelect}>
            <div className={styles.contentWrapper}>
              {page === 'leave' && <LeavingGame isTeacherClass />}
              {page === 'finish' && <FinishGame showModal={() => setShowModal(true)} />}

              {page === 'game' && <Game onClick={() => setPage('leave')} />}
            </div>
          </div>
          <div className={styles.contentContainer}>
            <OtherExercises isTeacherClasses showModal={showModal} changeShowModal={setShowModal} />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default observer(SpeechGame);
