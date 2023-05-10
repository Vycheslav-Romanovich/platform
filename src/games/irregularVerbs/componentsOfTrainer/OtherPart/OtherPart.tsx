import React from 'react';
import { useRouter } from 'next/router';

import style from './Part.module.css';
type PropsOtherPartType = {
  title: string;
  textBottom: string;
  levelText: string;
  image: any;
  id?: number;
  setIsOpenModal?: () => void;
};
const OtherPart = (props: PropsOtherPartType) => {
  const router = useRouter();
  const redirectOnNeedPart = () => {
    if (props.id) router.push(`/library/study/${props.id}`);
    props.setIsOpenModal();
  };
  return (
    <div
      className={style.container}
      onClick={() => {
        redirectOnNeedPart();
      }}
    >
      <div className={style.title}>{props.title}</div>
      <div className={style.bottom}>
        <div className={style.textBottom}>{props.textBottom}</div>
        <div>{props.levelText}</div>
        <div className={style.img}>{props.image}</div>
      </div>
    </div>
  );
};

export default OtherPart;
