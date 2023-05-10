import React, { FC } from 'react';
import { observer } from 'mobx-react';

import s from '~/games/matchingPairs/gameHeader/gameHeader.module.scss';

import Timer from '~/components/timer/timer';

interface GameHeader {
  youWon: boolean;
  page: string;
  gameWasLoaded: boolean;
  currentRound: number;
  rounds: number;
  callback: (minutes: number, seconds: number, milliseconds: number) => void;
}

const GameHeader: FC<GameHeader> = ({ youWon, gameWasLoaded, callback, page }) => {
  return !youWon && (page === 'game' || 'leave') && gameWasLoaded ? (
    <div className={page === 'leave' ? s.transparentComp : s.container}>
      <Timer gameIsLoaded={gameWasLoaded} callback={callback} />
    </div>
  ) : null;
};

export default observer(GameHeader);
