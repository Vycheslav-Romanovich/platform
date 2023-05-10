import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import s from '~/games/matchingPairs/leavingGamePage/leavingGamePage.module.scss';

interface LeavingGame {
  gameWasLoaded: boolean;
  onNoClick: () => void;
  isTeacherClass?: boolean;
}

const LeavingGamePage: React.FC<LeavingGame> = ({ gameWasLoaded, onNoClick, isTeacherClass }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { classId, teacherLessonId, lessonId } = router.query;
  const href = isTeacherClass
    ? `/teacher-classes/${classId}/${teacherLessonId}`
    : `/lessons/${lessonId}`;

  if (gameWasLoaded) {
    return (
      <div className={s.leavingScreen}>
        <p>{t('games.textLeave1')}</p>
        <p>{t('games.textLeave2')}</p>
        <div className={s.buttonsBlock}>
          <Button onClick={onNoClick} variant="outlined" size="large">
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
  }
};

export default observer(LeavingGamePage);
