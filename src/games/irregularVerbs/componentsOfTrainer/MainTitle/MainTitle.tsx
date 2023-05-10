import React from 'react';

import style from './MainTitle.module.scss';
type PropsMainTitleType = {
  title: string;
};
const MainTitle = (props: PropsMainTitleType) => {
  return <div className={style.title}>{props.title}</div>;
};

export default MainTitle;
