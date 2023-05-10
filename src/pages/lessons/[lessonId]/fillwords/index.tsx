import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Arrow from '../../../../assets/icons/arrows/arrow.svg';

import styles from './fillwords.module.scss';

import { InitLoader } from '~/components/initLoader';
import LinkStoreButton from '~/components/linkStoreButton/linkStoreButton';
import OtherExercises from '~/components/otherExercises';
import { FinishGame } from '~/games/fillWords/finishGame';
import GamePage from '~/games/fillWords/gamePage';
import { LeavingGame } from '~/games/fillWords/leavingGame';
import { sendEvent } from '~/helpers/sendToGtm';
import Layout from '~/hocs/layout';
import Notification from '~/modals/notification';
import { fillWordStore, lessonStore } from '~/stores';

const FillWords: NextPage = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { t } = useTranslation();
  const { lessonData } = lessonStore;
  const {
    loadData,
    isOpenedModal,
    fillWordDataStorage,
    round,
    page,
    countRound,
    currentCountAnswer,
    setIsOpenedModal,
    setPage,
    setLoadData,
    resetWord,
  } = fillWordStore;

  useEffect(() => {
    resetWord();
    return () => {
      resetWord();
    };
  }, []);

  useEffect(() => {
    if (lessonStore.isLoadingLessons === 'false') {
      setLoadData(true);
    }
  }, [lessonStore.isLoadingLessons, page]);

  useEffect(() => {
    if (page === 'finish' && round === countRound) {
      sendEvent('fillwords_complete', { words_learned: lessonData.word.length.toString() });
    }
  }, [round, countRound, page]);

  useEffect(() => {
    if (currentCountAnswer === fillWordDataStorage?.words.length) {
      setPage('finish');
    }
  }, [currentCountAnswer]);

  useEffect(() => {
    setPage('game');
  }, [setShowModal]);

  return (
    <Layout
      classNameHeaderWrapper={styles.hideHeaderMobile}
      className={styles.backgroundAdaptiveMobile}
      classNameContent={styles.layout}
    >
      <NextSeo title="Fillwords" />
      <Notification
        message={`Let's try another variant`}
        description={''}
        isOpen={isOpenedModal === 'DONE'}
        duration={1000}
        close={() => {
          setIsOpenedModal('');
        }}
      />
      <Notification
        message={''}
        description={'Oops...\nNot enough words to play'}
        isOpen={isOpenedModal === 'ERROR'}
        error={true}
        duration={1500}
        close={() => {
          setIsOpenedModal('');
        }}
      />

      <p className={styles.titleBlock}>
        <Arrow onClick={() => setPage('leave')} />
        <p>{`${lessonStore.lessonData?.name} / ${t('games.Fillwords')}`}</p>
      </p>
      {loadData ? (
        <div className={styles.wrapper}>
          <LinkStoreButton />
          <div className={styles.gameSelect}>
            {page === 'leave' && <LeavingGame />}
            <div className={styles.contentWrapper}>
              {page === 'finish' && <FinishGame onNextExerciseClick={() => setShowModal(true)} />}
              {page === 'game' && <GamePage />}
            </div>
          </div>
          <div className={styles.contentContainer}>
            <OtherExercises showModal={showModal} changeShowModal={setShowModal} />
          </div>
        </div>
      ) : (
        <InitLoader />
      )}
    </Layout>
  );
};
export default observer(FillWords);
