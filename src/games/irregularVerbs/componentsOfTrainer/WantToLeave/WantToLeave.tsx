import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

import styles from './WantToLeave.module.scss';
type PropsWantToLeave = {
  setPage: (str: string) => void;
};
const WantToLeave = (props: PropsWantToLeave) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleClickNo = () => {
    props.setPage('trainer');
  };

  const handleClickYes = () => {
    router.push('/library/study');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.leavingTitle}>
        <p>{t('games.textLeave1')}</p>
        <p>{t('games.textLeave2')}</p>
      </div>

      <div className={styles.endingGameButtonsWrapper}>
        <Button onClick={handleClickNo} size="large" variant="outlined">
          {t('games.no')}
        </Button>
        <Button onClick={handleClickYes} size="large" variant="contained">
          {t('games.yes')}
        </Button>
      </div>
    </div>
  );
};

export default WantToLeave;
