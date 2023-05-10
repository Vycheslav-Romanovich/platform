import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Arrow from '~/assets/icons/arrows/arrow.svg';
import Logo from '~/assets/images/GameChooseTheVariant.svg';

import Layout from '../../../../../hocs/layout';

import styles from './choose-the-variant.module.scss';

import OtherExercises from '~/components/otherExercises';
import { FinishGame } from '~/games/chooseTheVariant/finishGame';
import { Game } from '~/games/chooseTheVariant/game/game';
import { LeavingGame } from '~/games/chooseTheVariant/leavingGame';
import { sendEvent } from '~/helpers/sendToGtm';
import { lessonStore, variantStore } from '~/stores';

const CardGame: NextPage = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    currentIndexQuestion,
    page,
    currentRound,
    rounds,
    wordsInCurrentRound,
    wordsData,
    lessonName,
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
      setPage('finish');
      sendEvent('choose_var_complete', { words_learned: wordsData.length.toString() });
    }
  }, [currentIndexQuestion, setPage, wordsData]);

  useEffect(() => {
    if (currentIndexQuestion !== 0 && currentIndexQuestion === 12 * currentRound) {
      setPage('finish');
      sendEvent('choose_var_complete', { words_learned: wordsData.length.toString() });
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
    <Layout
      classNameHeaderWrapper={styles.hideHeaderMobile}
      className={styles.backgroundAdaptiveMobile}
    >
      <NextSeo title="Choose the variant" />
      <p className={styles.titleBlock}>
        <Arrow onClick={() => setPage('leave')} />
        <p>{`${lessonName} / Choose the variant`}</p>
      </p>

      <div className={styles.wrapper}>
        <div className={styles.gameSelect}>
          <div className={styles.contentWrapper}>
            {page === 'leave' && <LeavingGame isTeacherClass />}
            {page === 'finish' && (
              <FinishGame
                onNextExerciseClick={onNextExerciseClick}
                onStartAgainClick={onStartAgainClick}
                logo={<Logo />}
                skipWord={0}
              />
            )}

            {page === 'game' && <Game onClick={() => setPage('leave')} />}
          </div>
        </div>
        <div className={styles.contentContainer}>
          <OtherExercises isTeacherClasses showModal={showModal} changeShowModal={setShowModal} />
        </div>
      </div>
    </Layout>
  );
};

export default observer(CardGame);
