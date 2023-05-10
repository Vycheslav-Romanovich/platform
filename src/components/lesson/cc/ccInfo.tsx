import React, { FC, useState } from 'react';
import classNames from 'classnames';

import Icc from '../../../assets/icons/icc.svg';
import Polygon from '../../../assets/icons/polygon.svg';

import style from './ccInfo.module.scss';

type PropsCcInfoType = {
  isItemForLink: boolean;
  text: string;
  isErrorLink?: boolean;
  isErrorLine?: boolean;
};
const CcInfo: FC<PropsCcInfoType> = ({ text, isItemForLink, isErrorLink, isErrorLine }) => {
  const [isHint, setIsHint] = useState(false);
  const wrapperClass = classNames(style.main, {
    [style.mainErrorLink]: isErrorLink,
    [style.mainErrorLine]: isErrorLink && isErrorLine,
  });
  return (
    <div className={style.wrapper}>
      <div
        className={wrapperClass}
        onMouseOver={() => setIsHint(true)}
        onMouseOut={() => setIsHint(false)}
      >
        <div className={style.text}>CC</div>
        <Icc />
      </div>
      {isHint || isItemForLink ? (
        <div className={style.hint}>
          {text}
          <div className={style.polygon}>
            <Polygon />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default CcInfo;
