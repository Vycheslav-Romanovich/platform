import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './leavingGame.module.scss';

import { fillWordStore } from '~/stores';

type Props = {
  isTeacherClass?: boolean;
};

export const LeavingGame: React.FC<Props> = observer(({ isTeacherClass }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { prewPage, setPage, resetWord } = fillWordStore;

  const handleClickNo = () => {
    setPage(prewPage);
  };

  const handleClickYes = () => {
    resetWord();
    setPage('game');
  };
  const { classId, teacherLessonId, lessonId } = router.query;
  const href = isTeacherClass
    ? `/teacher-classes/${classId}/${teacherLessonId}`
    : `/lessons/${lessonId}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.leavingTitle}>
        <p>{t('games.textLeave1')}</p>
        <p>{t('games.textLeave2')}</p>
      </div>

      <div className={styles.endingGameButtonsWrapper}>
        <Button onClick={handleClickNo} variant="outlined" size="large">
          {t('games.no')}
        </Button>
        <Link href={href} passHref>
          <a>
            <Button onClick={handleClickYes} variant="contained" size="large">
              {t('games.yes')}
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
});
