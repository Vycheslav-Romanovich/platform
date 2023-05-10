import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Arrow from '~/assets/icons/arrows/arrow.svg';
import Logo from '~/assets/images/GameSpeechTraining.svg';

import styles from './speech-training.module.scss';

import LinkStoreButton from '~/components/linkStoreButton/linkStoreButton';
import OtherExercises from '~/components/otherExercises';
import { FinishGame } from '~/games/chooseTheVariant/finishGame';
import { Game } from '~/games/speechTraining/game/game';
import { LeavingGame } from '~/games/speechTraining/leavingGame';
import { sendEvent } from '~/helpers/sendToGtm';
import Layout from '~/hocs/layout';
import { lessonStore, variantStore } from '~/stores';

const SpeechGame: NextPage = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    currentIndexQuestion,
    page,
    currentRound,
    rounds,
    wordsInCurrentRound,
    wordsData,
    lessonName,
    skipWord,
    resetQuestionCounter,
    resetDataChooseGame,
    setWordsInCurrentRound,
    setCurrentStepInRound,
    setPage,
    setWordsData,
    setCurrentRound,
  } = variantStore;

  useEffect(() => {
    if (lessonStore.isLoadingLessons === 'false') {
      setWordsData();
    }

    return () => {
      resetQuestionCounter();
      resetDataChooseGame();
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
      sendEvent('check_pronun_complete');
      setPage('finish');
    }
  }, [currentIndexQuestion, setPage, wordsData]);

  useEffect(() => {
    if (currentIndexQuestion !== 0 && currentIndexQuestion === 12 * currentRound) {
      sendEvent('check_pronun_complete');
      setPage('finish');
    }
  }, [currentIndexQuestion]);

  const onNextExerciseClick = () => {
    setShowModal(true);
  };

  const onStartAgainClick = () => {
    setPage('game');
    setCurrentRound(1);
    resetQuestionCounter();
  };

  return (
    <>
      <NextSeo title="Check pronunciation" />

      <Layout
        classNameHeaderWrapper={styles.hideHeaderMobile}
        className={styles.backgroundAdaptiveMobile}
        classNameContent={styles.layout}
      >
        <p className={styles.titleBlock}>
          <Arrow onClick={() => setPage('leave')} />
          <p>{`${lessonName} / Check pronunciation`}</p>
        </p>

        <div className={styles.wrapper}>
          <LinkStoreButton />
          <div className={styles.gameSelect}>
            <div className={styles.contentWrapper}>
              {page === 'leave' && <LeavingGame />}
              {page === 'finish' && (
                <FinishGame
                  onNextExerciseClick={onNextExerciseClick}
                  onStartAgainClick={onStartAgainClick}
                  logo={<Logo />}
                  skipWord={skipWord}
                />
              )}

              {page === 'game' && <Game onClick={() => setPage('leave')} />}
            </div>
          </div>
          <div className={styles.contentContainer}>
            <OtherExercises showModal={showModal} changeShowModal={setShowModal} />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default observer(SpeechGame);
