import React from 'react';
import { useRouter } from 'next/router';

import style from './Part.module.scss';

type PropsPartType = {
  id: number;
  title: string;
  textBottom: string;
  levelText: string;
  image: any;
};
const Part = (props: PropsPartType) => {
  const router = useRouter();
  const redirect = (id: number) => router.push(`/library/study/${id}`);

  return (
    <div className={style.container} onClick={() => redirect(props.id)}>
      <div className={style.title}>{props.title}</div>
      <div className={style.bottom}>
        <div className={style.textBottom}>{props.textBottom}</div>
        <div>{props.levelText}</div>
        <div className={style.img}>{props.image}</div>
      </div>
    </div>
  );
};

export default Part;
