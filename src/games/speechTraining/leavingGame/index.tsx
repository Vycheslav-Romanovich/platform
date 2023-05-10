import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './leavingGame.module.scss';

import { variantStore } from '~/stores';
interface LeavingGame {
  isTeacherClass?: boolean;
}

export const LeavingGame: React.FC<LeavingGame> = observer(({ isTeacherClass }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { prewPage, setPage } = variantStore;

  const handleClickNo = () => {
    setPage(prewPage);
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
            <Button variant="contained" size="large">
              {t('games.yes')}
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
});
