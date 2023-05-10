import React from 'react';
import { Button } from '@mui/material';

import style from './index.module.scss';

type AlertPropsType = {
  title: string;
  verbs: string | undefined;
  textButton: string;
  failHandling: () => void;
};

export const Alert = (props: AlertPropsType) => {
  return (
    <div className={style.container}>
      <div>
        <div className={style.answer}>{props.title}</div>
        <div className={style.verbs}>{props.verbs}</div>
      </div>

      <Button
        onClick={() => props.failHandling()}
        color="primary"
        variant="contained"
        className={style.btn}
      >
        <span className={style.btnText}>{props.textButton}</span>
      </Button>
    </div>
  );
};
