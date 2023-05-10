import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import Link from 'next/link';

import ArrowNext from '../../assets/icons/arrows/arrowNext.svg';
import Level_1 from '~/assets/images/level_1.svg';

import { InitLoader } from '../initLoader';
import { LessonCardWrapper } from '../lesson/lessonCardWrapper';
import AppBanner from './appBanner/appBanner';
import SliderBanner from './sliderBanner/sliderBanner';

import styles from './index.module.scss';

import { PublicCard } from '~/components/lesson/publicCard';
import Part from '~/games/irregularVerbs/componentsOfTrainer/Part/Part';
import { partsOfVerbs } from '~/games/irregularVerbs/data/verbs';
import { sendEvent } from '~/helpers/sendToGtm';
import { CustomModal } from '~/modals/customModal';
import Notification from '~/modals/notification';
import { lessonStore, userStore } from '~/stores';

export const AuthLanding = observer(() => {
  const { t } = useTranslation();
  const [openNotifyModal, setOpenNotifyModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const deleteLesson = (id: number, isReceived: boolean, isFavorite: boolean) => {
    setOpenDeleteModal(true);
    if (id) {
      lessonStore.writeDeleteLessonData(id, isReceived, isFavorite);
    }
  };

  const closeDeleteModal = () => {
    setOpenDeleteModal(false);
    sendEvent('delete_lesson');
    setTimeout(() => {
      setOpenNotifyModal(true);
      lessonStore
        .deleteLessonCard(
          lessonStore.deleteLessonData.lessonId,
          lessonStore.deleteLessonData.isShared,
          lessonStore.deleteLessonData.isFavorite
        )
        .then(() => {
          updateLessonsWithWords();
        })
        .catch((error) => {
          console.error(error);
        });
    }, 1000);
  };

  const updateLessonsWithWords = () => {
    if (userStore.isAuth) {
      lessonStore.updateLessons();
    }
  };

  useEffect(() => {
    updateLessonsWithWords();
  }, [userStore.isAuth]);

  const getLessons = async () => {
    await lessonStore.getLessonDataPublic();
  };

  useEffect(() => {
    getLessons();
  }, []);

  return (
    <>
      <>
        <Notification
          isOpen={openNotifyModal}
          close={() => setOpenNotifyModal(false)}
          duration={500}
          message={t('lessons.done')}
          description={t('lessons.descriptionDelete')}
        />
        <CustomModal
          isOpen={openDeleteModal}
          close={() => setOpenDeleteModal(false)}
          modalClasses={styles.modalClasses}
          title={t('lessons.titleDelete')}
          subtitle1={t('lessons.subtitle1Delete')}
          access={closeDeleteModal}
          idYesButton={'delete_lesson'}
          buttonTextLeft={t('lessons.cancel')}
          buttonTextRight={t('lessons.delete')}
        />
      </>
      <div className={styles.wrapper}>
        <div className={styles.imageHome}>
          <SliderBanner />
        </div>

        <div className={styles.public}>
          <p>{t('authLanding.public')}</p>
          <Link href="/library/public">
            <a>
              {t('authLanding.view')}
              <ArrowNext />
            </a>
          </Link>
        </div>

        {lessonStore.isLoadingPublicLessons === 'true' ? (
          <InitLoader />
        ) : (
          <LessonCardWrapper>
            {lessonStore.lessonsPublic?.totalResults !== 0
              ? lessonStore?.lessonsPublic?.data
                  ?.slice(0, 3)
                  .map(({ id, mediaUrl, name, user, word, picture, level, avgRating }, i) => {
                    return (
                      <PublicCard
                        key={i}
                        id={id}
                        mediaUrl={mediaUrl}
                        titleLesson={name}
                        lessonOwnerAvatar={user.avatarUrl}
                        lessonOwnerName={user.name}
                        numberWords={+word.length}
                        coverIndex={picture}
                        level={level}
                        rating={avgRating}
                      />
                    );
                  })
              : t('authLanding.noLessons')}
          </LessonCardWrapper>
        )}

        {lessonStore.lessons.length !== 0 ? (
          <>
            <div className={styles.public}>
              <p>{t('authLanding.myLessons')}</p>

              <Link href="/lessons" passHref>
                <a>
                  {t('authLanding.view')}
                  <ArrowNext />
                </a>
              </Link>
            </div>
            <LessonCardWrapper>
              {lessonStore.isLoadingLessons === 'true' ? (
                <InitLoader />
              ) : lessonStore.lessons.length !== 0 ? (
                lessonStore.lessons
                  .slice(0, 3)
                  .map(({ id, mediaUrl, name, word, picture, level, avgRating }, i) => {
                    return (
                      <PublicCard
                        key={i}
                        id={id}
                        mediaUrl={mediaUrl}
                        titleLesson={name}
                        numberWords={+word.length}
                        isMyLesson={true}
                        coverIndex={picture}
                        level={level}
                        rating={avgRating}
                        deleteLesson={() => deleteLesson(id, false, false)}
                      />
                    );
                  })
              ) : null}
            </LessonCardWrapper>
          </>
        ) : null}

        <div className={styles.public}>
          <p>{t('authLanding.study')}</p>
          <Link href="/library/study">
            <a>
              {t('authLanding.view')}
              <ArrowNext />
            </a>
          </Link>
        </div>
        <div className={styles.publicPartList}>
          {partsOfVerbs.slice(0, 3).map((el) => (
            <Part
              key={el.id}
              id={el.id}
              title={t('authLanding.titleIrregular') + el.id}
              textBottom={t('authLanding.textIrregular')}
              levelText={t('authLanding.levelIrregular')}
              image={<Level_1 />}
            />
          ))}
        </div>
        <AppBanner />
      </div>
    </>
  );
});
