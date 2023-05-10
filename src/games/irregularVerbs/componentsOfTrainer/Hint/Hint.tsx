import React from 'react';

import ImageHint from '~/assets/images/hint.svg';

import style from './Hint.module.css';

import { sendEvent } from '~/helpers/sendToGtm';
type PropsHintType = {
  setIsHint: (value: boolean) => void;
};
const Hint = (props: PropsHintType) => {
  return (
    <div
      id={'usehint'}
      className={style.main}
      onClick={() => {
        props.setIsHint(true);
        sendEvent('use_hint_verbs');
      }}
    >
      <ImageHint />
    </div>
  );
};

export default Hint;
