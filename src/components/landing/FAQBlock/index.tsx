import React, { useState } from 'react';
import { Typography } from '@mui/material';
import cn from 'classnames';

import styles from './index.module.scss';

import { sendEvent } from '~/helpers/sendToGtm';

type OpenListFAQType = {
  numberQuestion: number;
  title: string;
  descriptionText: string;
};

export const OpenListFAQ: React.FC<OpenListFAQType> = ({
  numberQuestion,
  title,
  descriptionText,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const plusClasses = cn(styles.plus, {
    [styles.open]: open,
  });

  const descriptionClasses = cn(styles.descriptionBlock, {
    [styles.descriptionBlockOpen]: open,
  });

  const openAnswer = () => {
    !open && sendEvent('faq_show_more');
    setOpen((prevState) => !prevState);
  };

  return (
    <div className={styles.openListFaqContainer}>
      <div onClick={openAnswer} className={styles.block1}>
        <div className={styles.titleBlock}>
          <Typography variant={'h2'} color={'var(--L_Grey)'}>
            0{numberQuestion}
          </Typography>
          <Typography variant={'h3'}>{title}</Typography>
        </div>
        <div className={plusClasses} />
      </div>
      <div className={descriptionClasses}>
        <Typography paddingLeft={{ md: '96px', xs: '0px' }} maxWidth={'80%'} variant={'body1'}>
          {descriptionText}
        </Typography>
      </div>
    </div>
  );
};
