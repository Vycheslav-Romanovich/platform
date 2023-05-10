import React, { FC } from 'react';
import { observer } from 'mobx-react';

import Arrow from '~/assets/icons/arrows/arrow.svg';

import s from '~/games/matchingPairs/navigationBarInGame/navigationBarInGame.module.scss';

type NavBar = {
  lessonName: string;
  gameName?: string;
  callback: () => void;
};

const NavBarInGame: FC<NavBar> = ({ lessonName, callback, gameName }) => {
  if (!gameName) {
    gameName = 'Matching Pairs';
  }
  return (
    <p className={s.arrowWrapper}>
      <Arrow onClick={callback} />
      <p>{`${lessonName} / ${gameName}`}</p>
    </p>
  );
};

export default observer(NavBarInGame);
