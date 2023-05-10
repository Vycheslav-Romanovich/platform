import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './index.module.scss';

import { InitLoader } from '~/components/initLoader';
import { LessonCardWrapper } from '~/components/lesson/lessonCardWrapper';
import { PublicCard } from '~/components/lesson/publicCard';
import { lessonsStates, lessonsStatesTeacher } from '~/constants/routes';
import { sortByOrder } from '~/constants/sortLessons';
import { sendEvent } from '~/helpers/sendToGtm';
import CreateLesson from '~/modals/createLesson';
import { CustomModal } from '~/modals/customModal';
import Notification from '~/modals/notification';
import { lessonStore, sortStore, userStore } from '~/stores';
import { SortByOrderType } from '~/types/sort';
import SortDropdown from '~/UI/sortDropdown';
import TabBar from '~/UI/tabBar';
import { AccordionCreateLesson } from '~/widget/AccordionCreateLesson';

const LessonPageComponent: React.FC = () => {
  const { asPath, replace } = useRouter();
  const { t } = useTranslation();
  const [closePopup, setClosePopup] = useState<boolean>(lessonStore.createLessonModal);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openNotifyModal, setOpenNotifyModal] = useState<boolean>(false);
  const [linkToCopy, setLinkToCopy] = useState('');
  const [showHighlighted, setShowHighlighted] = useState(false);
  const [showSorting, setShowSorting] = useState(true);

  const updateLessonsWithWords = () => {
    lessonStore.updateLessons();
  };

  useEffect(() => {
    if (popoverOpen) {
      setTimeout(() => {
        setPopoverOpen(false);
      }, 2000);
    }
  }, [popoverOpen]);

  const closeModalWindow = () => {
    setShowHighlighted(true);
    sortStore.setLessonsSorted('date:desc', lessonStore.lessons);
    sortStore.setLessonsSorted('date:desc', lessonStore.sharedLessons);
    setClosePopup(false);
    lessonStore.setCreateLessonModal(false);
    setTimeout(() => {
      setShowHighlighted(false);
    }, 1200);
    lessonStore.resetLessonDataAndSentenseWithWordData();
  };

  useEffect(() => {
    // redirection of a teacher/student
    asPath === '/lessons' ? replace('/lessons?q=created') : asPath;
    setLinkToCopy(`https://${window.location.host}/lessons/${lessonStore.newLessonId}?shared=true`);
  }, [asPath]);

  const deleteLesson = (id: number, isReceived: boolean, isFavorite) => {
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

  const sortByType = (sortType: SortByOrderType) => {
    if (asPath === '/lessons?q=created') {
      sortStore.setLessonsSorted(sortType, lessonStore.lessons);
    } else {
      if (asPath === '/lessons?q=favorite') {
        sortStore.setLessonsSorted(sortType, lessonStore.favoriteLessons);
      } else {
        sortStore.setLessonsSorted(sortType, lessonStore.sharedLessons);
      }
    }
  };

  const handleChangeSort = (event) => {
    const name = event.target.name;
    const value = event.target.value as SortByOrderType;
    sortByType(value);
    sortStore.setSortTypes({ [name]: value });
  };

  useEffect(() => {
    sortByType(sortStore.sortTypes.order);
  }, [asPath]);

  useEffect(() => {
    asPath === '/lessons?q=received'
      ? lessonStore.sharedLessons.length > 0
        ? setShowSorting(true)
        : setShowSorting(false)
      : lessonStore.lessons.length > 0
      ? setShowSorting(true)
      : setShowSorting(false);
  }, [asPath, lessonStore.sharedLessons, lessonStore.lessons]);

  return (
    <>
      <CreateLesson
        isOpen={closePopup}
        createLesson={linkToCopy}
        newLesson={lessonStore.lessonData}
        close={closeModalWindow}
      />

      <Notification
        isOpen={openNotifyModal}
        close={() => setOpenNotifyModal(false)}
        duration={500}
        message={'Done'}
        description={'The lesson was deleted'}
      />

      <CustomModal
        isOpen={openDeleteModal}
        close={() => setOpenDeleteModal(false)}
        modalClasses={styles.modalClasses}
        title="Delete the lesson?"
        subtitle1="You will lose it forever"
        access={closeDeleteModal}
        idYesButton={'delete_lesson'}
        buttonTextLeft={'Cancel'}
        buttonTextRight={'Delete'}
      />

      <div className={styles.headerWrapper}>
        <Typography variant="h2">{t('routes.navLinks.My lessons')}</Typography>

        <AccordionCreateLesson className={styles.accordion} />
        {showSorting && (
          <div className={styles.sortingStyles}>
            <SortDropdown
              sortValue={sortStore.sortTypes.order}
              handleChangeSort={handleChangeSort}
              sortOptions={sortByOrder}
            />
          </div>
        )}
      </div>

      <TabBar
        data={userStore?.user?.role === 'teacher' ? lessonsStatesTeacher : lessonsStates}
        nameData="lessonsStates"
      />

      {lessonStore.isLoadingLessons === 'true' ? (
        <InitLoader />
      ) : (
        <>
          {asPath === '/lessons?q=received' &&
            (lessonStore.sharedLessons.length !== 0 ? (
              <LessonCardWrapper>
                {lessonStore.sharedLessons.map(
                  ({ mediaUrl, name, user, word, picture, level, avgRating, sharedLessons }) => {
                    return (
                      <PublicCard
                        key={sharedLessons[0].id}
                        id={sharedLessons[0].lessonId}
                        mediaUrl={mediaUrl}
                        titleLesson={name}
                        lessonOwnerAvatar={user.avatarUrl}
                        lessonOwnerName={user.name}
                        numberWords={+word.length}
                        isReceived={true}
                        coverIndex={picture}
                        level={level}
                        rating={avgRating}
                        deleteLesson={() => deleteLesson(sharedLessons[0].id, true, false)}
                      />
                    );
                  }
                )}
              </LessonCardWrapper>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  maxWidth: '468px',
                }}
              >
                <Typography variant="h3" sx={{ mb: '16px' }}>
                  {t('lessons.noLessons')}
                </Typography>
                <Typography variant="body1">{t('lessons.askTeacher')}</Typography>
              </Box>
            ))}
          {asPath === '/lessons?q=created' &&
            (lessonStore.lessons.length !== 0 ? (
              <LessonCardWrapper>
                {lessonStore.lessons.map(
                  ({ id, mediaUrl, name, user, word, picture, level, avgRating }) => {
                    return (
                      <PublicCard
                        key={id}
                        id={id}
                        mediaUrl={mediaUrl}
                        titleLesson={name}
                        lessonOwnerAvatar={user.avatarUrl}
                        lessonOwnerName={user.name}
                        numberWords={+word.length}
                        isMyLesson
                        coverIndex={picture}
                        level={level}
                        rating={avgRating}
                        deleteLesson={() => deleteLesson(id, false, false)}
                        highlightId={lessonStore.newLessonId}
                        showHighlighted={showHighlighted}
                      />
                    );
                  }
                )}
              </LessonCardWrapper>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  maxWidth: '468px',
                }}
              >
                <Typography variant="h3" sx={{ mb: '16px' }}>
                  {t('lessons.noCreatedLessons')}
                </Typography>
                <Typography variant="body1">{t('lessons.lessonsCreating')}</Typography>
              </Box>
            ))}
          {asPath === '/lessons?q=favorite' &&
            (lessonStore.favoriteLessons.length !== 0 ? (
              <LessonCardWrapper>
                {lessonStore.favoriteLessons.map(
                  ({
                    id,
                    mediaUrl,
                    favoriteLessons,
                    name,
                    user,
                    word,
                    picture,
                    level,
                    avgRating,
                  }) => {
                    return (
                      <PublicCard
                        key={id}
                        id={id}
                        mediaUrl={mediaUrl}
                        titleLesson={name}
                        lessonOwnerAvatar={user.avatarUrl}
                        lessonOwnerName={user.name}
                        numberWords={+word.length}
                        isReceived={true}
                        coverIndex={picture}
                        level={level}
                        rating={avgRating}
                        deleteLesson={() => deleteLesson(favoriteLessons[0].id, false, true)}
                        highlightId={lessonStore.newLessonId}
                        showHighlighted={showHighlighted}
                      />
                    );
                  }
                )}
              </LessonCardWrapper>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  maxWidth: '468px',
                }}
              >
                <Typography variant="h3" sx={{ mb: '16px' }}>
                  {t('lessons.nothingSaved')}
                </Typography>
                <Typography variant="body1">
                  {t('lessons.seeLessons')}{' '}
                  <Link href={`/library/public`} passHref>
                    <span className={styles.linkPublic}>{t('lessons.publicLessons')}</span>
                  </Link>
                </Typography>
              </Box>
            ))}
        </>
      )}
    </>
  );
};
export default observer(LessonPageComponent);
