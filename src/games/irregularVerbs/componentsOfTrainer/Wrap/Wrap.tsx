import React from 'react';

import { partsOfVerbs } from '../../data/verbs';
import { MessagesInterface } from '../../models/model_verbs';
import Part from '../Part/Part';

import style from './Wrap.module.scss';
type PropsWrapType = {
  array: MessagesInterface[];
  title: string;
  textBottom: string;
  levelText: string;
  image: any;
};
const Wrap = (props: PropsWrapType) => {
  return (
    <div className={style.wrap}>
      {partsOfVerbs.map((el) => (
        <Part
          key={el.id}
          id={el.id}
          title={props.title + ' ' + el.id}
          textBottom={props.textBottom}
          levelText={props.levelText}
          image={props.image}
        />
      ))}
    </div>
  );
};

export default Wrap;
