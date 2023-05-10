import React from 'react';

import style from './Translate.module.scss';

type PropsTranslateType = {
  translate: string | undefined;
};
const Translate = (props: PropsTranslateType) => {
  return <div className={style.translate}>{props.translate}</div>;
};

export default Translate;
