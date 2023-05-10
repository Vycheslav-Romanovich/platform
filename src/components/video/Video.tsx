import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@mui/material';
import { observer } from 'mobx-react';

import styles from './video.module.scss';

import ControlPanel from '~/components/conrolPanel';
import Player from '~/components/player';
import { TermsAndActivitiesList } from '~/components/video/termsAndActivitiesList/termsAndActivitiesList';
import Notification from '~/modals/notification';
import { lessonStore, mainStore, openEndedGameStore, videoStore } from '~/stores';

type Props = {
  id: string | null;
  withSubtitles: boolean;
  modal?: boolean;
  wordBan?: boolean;
  warningCondition?: boolean;
};

function Video({ id, withSubtitles, modal, wordBan, warningCondition }: Props) {
  const isMobileSize = useMediaQuery('(max-width:639px)');
  const { t } = useTranslation();

  useEffect(() => {
    const mainEl = document.querySelector('main');
    const bodyEl = document.querySelector('body');

    return () => {
      lessonStore.resetNewLesson();
      if (mainStore.usedPlatform === 'ios') {
        bodyEl.style.backgroundColor = 'var(--dark1)';
        mainEl.style.backgroundColor = '';
      }

      // reset time in player
      videoStore.resetTime();
    };
  }, []);

  return (
    <>
      <Player
        modal={modal}
        id={id}
        wordBan={wordBan}
        withSubtitles={withSubtitles}
        warningCondition={warningCondition}
      />

      {isMobileSize && videoStore.state.createLessonMode && <ControlPanel />}

      <div className={styles.boxContainer}>
        <TermsAndActivitiesList warningCondition={warningCondition} />
      </div>

      <Notification
        isOpen={openEndedGameStore.saveNotification}
        close={() => openEndedGameStore.setSaveNotification(false)}
        duration={1500}
        message={t('interactiveGame.activityAdded')}
      />
    </>
  );
}

export default observer(Video);
