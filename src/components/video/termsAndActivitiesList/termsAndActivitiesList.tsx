import React from 'react';
import { observer } from 'mobx-react';

import { WarningBox } from './entities/warningBox';
import { ActivityList } from './features/activityList';
import { WordsList } from './features/wordsList';

import styles from './termsAndActivitiesList.module.scss';

import { SwitcherFromActivity } from '~/components/video/switcherFromActivity/switcherFromActivity';
import { lessonStore, openEndedGameStore, videoStore } from '~/stores';

type Props = {
  warningCondition?: boolean;
};

export const TermsAndActivitiesList: React.FC<Props> = observer(({ warningCondition }) => {
  return (
    <div className={styles.boxWrapper}>
      <SwitcherFromActivity
        wordCount={lessonStore?.lessonData?.word?.length}
        activityCount={openEndedGameStore.countActivity}
      />

      <div className={styles.box}>
        {lessonStore.variantBox === 'word' && lessonStore.lessonData !== null && <WordsList />}

        {lessonStore.variantBox === 'activity' && openEndedGameStore.gameData !== null && (
          <ActivityList
            videoInteractiveName={lessonStore.videoInteractiveName}
            timeCode={videoStore.state.time}
          />
        )}

        {openEndedGameStore.templateArray.size < 3 && warningCondition && (
          <WarningBox type={lessonStore.variantBox} />
        )}
      </div>
    </div>
  );
});
