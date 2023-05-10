import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Tick from '~/assets/images/tick.svg';

import s from './gameDescriptionInModalWindow.module.scss';

import { lessonStore } from '~/stores';

interface GameBioPart {
  Img: any;
  title: string;
  path: string;
  isTeacherCLass?: boolean;
}
const GameDescriptionInModalWindow = ({ Img, title, path, isTeacherCLass }: GameBioPart) => {
  const { gameArray } = lessonStore;
  const router = useRouter();
  const { t } = useTranslation();
  const { lessonId, classId, teacherLessonId } = router.query;
  return (
    <Link
      href={
        isTeacherCLass
          ? `/teacher-classes/${classId}/${teacherLessonId}/${path}`
          : `/lessons/${lessonId}/${path}`
      }
      passHref
    >
      <a>
        <div className={s.gameIconsContainer}>
          <Img className={s.smallIconWrapper} />
          <div className={s.gameTitle}>
            <div>{t(`games.${title}`)}</div>
            <div className={s.tick}>{gameArray.includes(path.split('-')[0]) && <Tick />}</div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default GameDescriptionInModalWindow;
