import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowBackIosNew } from '@mui/icons-material';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import s from './otherExercises.module.scss';

import GameDescriptionInBlock from '~/components/otherExercises/gameDescriptionInBlock/gameDescriptionInBlock';
import GameDescriptionInModalWindow from '~/components/otherExercises/gameDescriptionInModalWindow/gameDescriptionInModalWindow';
import { gameBlock } from '~/constants/blocks';
import { lessonStore, userStore } from '~/stores';
import Modal from '~/UI/modal';

interface OtherExercises {
  showModal: boolean;
  changeShowModal: (showModal: boolean) => void;
  isTeacherClasses?: boolean;
}

interface GameIcon {
  Img: any;
}

const GameIcon = ({ Img }: GameIcon) => {
  return <Img />;
};

const OtherExercises = (props: OtherExercises) => {
  const [version, setVersion] = useState<'mobile' | 'desktop'>('desktop');
  const [countLetterWord, setCountLetterWord] = useState<number>();
  const [videoLesson, setVideoLesson] = useState<boolean>(true);
  const { gameArray } = lessonStore;
  const router = useRouter();
  const { lessonId, classId, teacherLessonId } = router.query;
  const { t } = useTranslation();

  useEffect(() => {
    const screenWidth = window.innerWidth;
    setVersion(screenWidth > 768 ? 'desktop' : 'mobile');
  }, []);

  useEffect(() => {
    if (lessonStore.lessonData && userStore.user) {
      setVideoLesson(!!lessonStore.lessonData.mediaUrl);
    }
  }, [userStore.user, lessonStore.lessonData]);

  useEffect(() => {
    if (lessonStore.isLoadingLessons === 'false') {
      let countLetterWord = 0;
      if (lessonStore.lessonData && lessonStore.lessonData.word) {
        lessonStore.lessonData.word.forEach((item) => {
          if (item.word.length <= 19) countLetterWord += item.word.length;
        });
        countLetterWord != 0 ? setCountLetterWord(countLetterWord) : setCountLetterWord(1);
      }
    }
  }, [lessonStore.isLoadingLessons]);

  const sortGame = (arr) => {
    const gamesBlockSort = [];
    for (let i = 0; i < arr.length; i++) {
      const test = gameArray.includes(arr[i].path.split('-')[0]);
      if (test) {
        gamesBlockSort.push(arr[i]);
      } else {
        gamesBlockSort.unshift(arr[i]);
      }
    }
    return gamesBlockSort;
  };

  const gamesForOtherExercises = videoLesson
    ? gameBlock.filter((game) => {
        return countLetterWord > game.countLetterWord && !game.copy;
      })
    : gameBlock.filter((game) => {
        return !game.withVideo && countLetterWord > game.countLetterWord;
      });

  const gamesBlock = videoLesson
    ? gameBlock.filter((game) => {
        return countLetterWord > game.countLetterWord && !game.copy;
      })
    : gameBlock.filter((game) => {
        return !game.withVideo && countLetterWord > game.countLetterWord;
      });
  const gamesBlockSortedIsDone = sortGame(gamesBlock);
  const gamesSorted = sortGame(gamesForOtherExercises);
  gamesSorted.length = 3;
  return (
    <>
      {version === 'mobile' && props.showModal && (
        <div>
          <Modal
            isOpen={props.showModal}
            close={() => props.changeShowModal(false)}
            wrapperClasses={s.popupWindow}
            modalClasses={s.modalBodyStyle}
          >
            <span style={{ paddingBottom: 50, textAlign: 'center' }}>
              {t('otherExercises.chooseWay')}
            </span>
            {gamesSorted.map((game, i) => {
              return (
                <Link
                  key={i}
                  href={
                    props.isTeacherClasses
                      ? `/teacher-classe/${classId}/${teacherLessonId}/${game.path}`
                      : `/lessons/${lessonId}/${game.path}`
                  }
                  passHref
                >
                  <a>
                    <div className={s.gameBlock}>
                      <div className={s.iconWrapper}>
                        <GameIcon Img={game.ImgMobile} />
                      </div>
                      <div className={s.gameBio}>
                        <div className={s.smallGameTitle}>{t(`games.${game.title}`)}</div>
                        <div className={s.smallGameDescription}>{t(`games.${game.text}`)}</div>
                      </div>
                    </div>
                  </a>
                </Link>
              );
            })}
            <div className={s.adaptiveBtn}>
              <Button onClick={() => props.changeShowModal(false)} variant="outlined" size="large">
                <ArrowBackIosNew style={{ height: 15 }} />
                {t('otherExercises.back')}
              </Button>
            </div>
          </Modal>
        </div>
      )}
      {version === 'desktop' && (
        <div className={s.otherExercisesWrapper}>
          <Modal
            isOpen={props.showModal}
            close={() => props.changeShowModal(false)}
            wrapperClasses={s.popupWindow}
            modalClasses={s.modalBodyStyle}
          >
            {t('otherExercises.otherExercises')}
            <div className={s.popupWindowContent}>{t('otherExercises.chooseOther')}</div>
            <div className={s.smallGameIconsContainer}>
              {gamesBlockSortedIsDone.map((item, index) => {
                return (
                  <GameDescriptionInModalWindow
                    key={index}
                    Img={item.Img}
                    title={item.title}
                    path={item.path}
                    isTeacherCLass={props.isTeacherClasses}
                  />
                );
              })}
            </div>
          </Modal>
          {t('otherExercises.otherExercises')}
          {gamesSorted.map((item, index) => {
            return (
              <GameDescriptionInBlock
                key={index}
                Img={item.ImgMobile}
                title={item.title}
                text={item.text}
                path={item.path}
                isTeacherCLass={props.isTeacherClasses}
              />
            );
          })}
          <div className={s.showAll} onClick={() => props.changeShowModal(true)}>
            {t('otherExercises.showAll')}
          </div>
        </div>
      )}
    </>
  );
};

export default OtherExercises;
