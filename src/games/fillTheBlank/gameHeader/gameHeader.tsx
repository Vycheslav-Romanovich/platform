import React, { FC } from 'react';
import { observer } from 'mobx-react';

import s from '~/games/fillTheBlank/gameHeader/gameHeader.module.scss';

import AdaptiveProgressBar from '~/components/adaptiveProgressBar/adaptiveProgressBar';

interface GameHeader {
  stepINRound: number;
  wordsInRound: number;
  currentRound: number;
  rounds: number;
}

const GameHeader: FC<GameHeader> = ({ wordsInRound, stepINRound }) => {
  return (
    <div className={s.container}>
      <AdaptiveProgressBar
        currentValue={stepINRound}
        maxLength={wordsInRound}
        isValue={true}
        step={0}
      />
    </div>
  );
};

export default observer(GameHeader);
