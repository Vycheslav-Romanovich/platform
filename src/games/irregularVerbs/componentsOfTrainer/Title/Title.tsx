import React from 'react';

import style from './Title.module.css';
type PropsTitleType = {
  title: string;
};
const Title = (props: PropsTitleType) => {
  return <div className={style.title}>{props.title}</div>;
};

export default Title;
