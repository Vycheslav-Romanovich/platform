import React, { FC } from 'react';

import style from './mobileCountWords.module.scss';

type PropsMobileCountWordsType = {
  itemData: {
    onClick: () => void;
    icon: JSX.Element;
    count: number;
  }[];
};

export const MobileCountWords: FC<PropsMobileCountWordsType> = ({ itemData }) => {
  return (
    <div className={style.wrapper}>
      {itemData.map(({ onClick, icon, count }, index) => (
        <div key={index} className={style.button} onClick={onClick}>
          <div className={style.wordRight}>{icon}</div>
          <span className={style.count}>{count}</span>
        </div>
      ))}
    </div>
  );
};
