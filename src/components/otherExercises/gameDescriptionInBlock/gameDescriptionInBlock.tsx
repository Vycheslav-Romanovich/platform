import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Tick from '~/assets/images/tick.svg';

import s from './gameDescriptionInBlock.module.scss';

import { lessonStore } from '~/stores';

interface GameBio {
  Img: any;
  title: string;
  text: string;
  path: string;
  isTeacherCLass: boolean;
}

const OtherExercises = ({ Img, title, path, isTeacherCLass }: GameBio) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { gameArray } = lessonStore;
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
        <div className={s.gameMiniature}>
          <div className={s.iconWrapper}>
            <div className={s.icon}>
              <Img />
            </div>
          </div>
          <div className={s.block}>
            <Typography variant="body1" className={s.title}>
              {t(`games.${title}`)}
            </Typography>
            <div className={s.tick}>{gameArray.includes(path.split('-')[0]) && <Tick />}</div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default OtherExercises;
