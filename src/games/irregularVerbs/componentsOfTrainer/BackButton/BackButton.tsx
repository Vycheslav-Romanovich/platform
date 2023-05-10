import React, { FC } from 'react';
import { Button } from '@mui/material';

import Left from '~/assets/icons/left.svg';

import style from './BackButton.module.scss';

type PropsBacButtonType = {
  setPage: () => void;
};
const BackButton: FC<PropsBacButtonType> = ({ setPage }) => {
  return (
    <>
      <Button onClick={setPage} variant="outlined" className={style.primaryBtn}>
        <div className={style.left}>
          <Left />
        </div>
        <span className={style.textBtn}>Back</span>
      </Button>
    </>
  );
};

export default BackButton;
