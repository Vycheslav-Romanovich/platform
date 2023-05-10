import React from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react';

import { ChooseVariant } from '../chooseVariant';

import styles from './game.module.scss';

import AdaptiveProgressBar from '~/components/adaptiveProgressBar/adaptiveProgressBar';
import { lessonStore, variantStore } from '~/stores';

interface Props {
  onClick: () => void;
}

export const Game = observer(({ onClick }: Props) => {
  const { wordsData } = lessonStore;
  const { currentIndexQuestion, currentStepInRound, wordsInCurrentRound } = variantStore;

  return (
    <>
      {currentIndexQuestion < wordsData.length ? (
        <>
          <div className={styles.container}>
            <AdaptiveProgressBar
              currentValue={currentStepInRound}
              maxLength={wordsInCurrentRound}
              isValue={true}
              step={0}
            />
            <div className={styles.adaptiveBtn}>
              <IconButton onClick={onClick}>
                <CloseRoundedIcon style={{ height: 24 }} />
              </IconButton>
            </div>
          </div>
          <ChooseVariant />
        </>
      ) : null}
    </>
  );
});
