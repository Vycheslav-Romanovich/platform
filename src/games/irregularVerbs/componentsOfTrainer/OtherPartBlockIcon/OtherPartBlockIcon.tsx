import React from 'react';
import { useRouter } from 'next/router';

import style from './OtherPArtBlockIcon.module.scss';

type PropsOtherPartType = {
  title: string;
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
      <div className={style.img}>{props.image}</div>
    </div>
  );
};

export default OtherPart;
