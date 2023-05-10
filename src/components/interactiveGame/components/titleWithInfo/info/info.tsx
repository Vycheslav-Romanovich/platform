import React, { FC, useState } from 'react';

import Icc from '~/assets/icons/icc.svg';
import Polygon from '~/assets/icons/polygon.svg';

import style from './info.module.scss';

type PropsInfoType = {
  text: string;
  width: number;
  height: number;
  bottomPolygon: number;
  marginHint: number;
};
const Info: FC<PropsInfoType> = ({ text, width, height, bottomPolygon, marginHint }) => {
  const [isHint, setIsHint] = useState(false);

  return (
    <div className={style.wrapper}>
      <div
        className={style.main}
        onMouseOver={() => setIsHint(true)}
        onMouseOut={() => setIsHint(false)}
      >
        <Icc />
      </div>

      {isHint && (
        <div className={style.hint} style={{ width: width, height: height, marginTop: marginHint }}>
          {text}
          <div className={style.polygon} style={{ bottom: bottomPolygon }}>
            <Polygon />
          </div>
        </div>
      )}
    </div>
  );
};

export default Info;
