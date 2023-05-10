import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import styles from './index.module.scss';

import { InitLoader } from '~/components/initLoader';
import { LessonCardWrapper } from '~/components/lesson/lessonCardWrapper';
import { PublicCard } from '~/components/lesson/publicCard';
import { lessonsStates, lessonsStatesTeacher } from '~/constants/routes';
import { sortByOrder } from '~/constants/sortLessons';
import { PageTitle } from '~/entities/PageTitle';
import { sendEvent } from '~/helpers/sendToGtm';
import Layout from '~/hocs/layout';
import AsssignLessonsToClass from '~/modals/assignLessonToClass';
import CreateClass from '~/modals/createClass';
import CreateLesson from '~/modals/createLesson';
import { CustomModal } from '~/modals/customModal';
import Notification from '~/modals/notification';
import { lessonStore, sortStore, teacherClassesStore, userStore } from '~/stores';
import { SortByOrderType } from '~/types/sort';
import SortDropdown from '~/UI/sortDropdown';
import TabBar from '~/UI/tabBar';
import { AccordionCreateLesson } from '~/widget/AccordionCreateLesson';

const Lessons: NextPage = () => {
  const { asPath, replace, query } = useRouter();
  const { t } = useTranslation();
  const [closePopup, setClosePopup] = useState<boolean>(lessonStore.createLessonModal);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openNotifyModal, setOpenNotifyModal] = useState<boolean>(false);
  const [linkToCopy, setLinkToCopy] = useState('');
  const [showHighlighted, setShowHighlighted] = useState(false);
  const [showSorting, setShowSorting] = useState(true);

  const [openCreateClassModal, setOpenCreateClassModal] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [isCreateClass, setIsCreateClass] = useState(false);

  const updateLessonsOnPage = () => {
    lessonStore.updateLessons();
  };

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
          updateLessonsOnPage();

          // for check limit by created lessons
          userStore.getUserInfo();
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
    updateLessonsOnPage();
  }, [userStore.isAuth]);

  useEffect(() => {
    if (popoverOpen) {
      setTimeout(() => {
        setPopoverOpen(false);
      }, 2000);
    }
  }, [popoverOpen]);

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
    if (asPath === '/lessons?q=favorite')
      lessonStore.favoriteLessons.length > 0 ? setShowSorting(true) : setShowSorting(false);
  }, [asPath, lessonStore.sharedLessons, lessonStore.lessons]);

  useEffect(() => {
    // redirection of a teacher/student
    asPath === '/lessons'
      ? userStore?.user?.role === 'teacher'
        ? replace('/lessons?q=created')
        : replace('/lessons?q=received')
      : asPath;
    setLinkToCopy(`https://${window.location.host}/lessons/${lessonStore.newLessonId}?shared=true`);
  }, [asPath, userStore.user.role]);

  const checkToAssignLesson = async () => {
    const teacherClassesLength = await teacherClassesStore.getClassesByUserId();
    if (teacherClassesLength) {
      setShowClasses((prev) => !prev);
    } else {
      setOpenCreateClassModal(true);
    }
  };

  return (
    <>
      <NextSeo
        title={t(`seo.lessons.${query.q?.toString()}.name`)}
        description={t(`seo.lessons.${query.q?.toString()}.description`)}
        additionalMetaTags={[
          { property: 'keywords', content: t(`seo.lessons.${query.q?.toString()}.keyWords`) },
        ]}
      />

      <Layout>
        <CustomModal
          isOpen={openCreateClassModal}
          close={() => setOpenCreateClassModal(false)}
          modalClasses={styles.modalClasses}
          title={t('lessonId.titleAssign')}
          subtitle1={t('lessonId.subtitle1NoClasses')}
          access={() => {
            setOpenCreateClassModal((prev) => !prev);
            setIsCreateClass((prev) => !prev);
          }}
          buttonTextLeft={t('lessonId.cancel')}
          buttonTextRight={t('lessonId.createClass')}
        />
        <CreateClass
          isOpen={isCreateClass}
          close={() => setIsCreateClass((prev) => !prev)}
          isCreateModal={!teacherClassesStore.isEditClassModal}
          shouldAssignLesson
          lessonId={lessonStore.newLessonId}
        />
        <AsssignLessonsToClass
          isOpen={showClasses}
          close={() => {
            setShowClasses(false);
            teacherClassesStore.toggleDoneButton(false);
          }}
          headerText={t('lessonId.titleAssign')}
          currentLessonId={lessonStore.newLessonId}
        />
        <CreateLesson
          isOpen={closePopup}
          createLesson={linkToCopy}
          newLesson={lessonStore.lessonData}
          close={closeModalWindow}
          checkToAssignLesson={() => {
            checkToAssignLesson();
            closeModalWindow();
          }}
        />
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
          withoutCloseBtn={false}
          title={t('lessons.titleDelete')}
          subtitle1={t('lessons.subtitle1Delete')}
          access={closeDeleteModal}
          idYesButton={'delete_lesson'}
          buttonTextLeft={t('lessons.cancel')}
          buttonTextRight={t('lessons.delete')}
        />

        <PageTitle
          title={t('routes.navLinks.My lessons')}
          childrenTearTitle={<AccordionCreateLesson showLock className={styles.accordion} />}
        >
          <>
            <TabBar
              isPrem={userStore.user.isActivePremium}
              data={userStore.user.role === 'teacher' ? lessonsStatesTeacher : lessonsStates}
              nameData="lessonsStates"
            />
            <Box className={styles.headerWrapper}>
              {showSorting && (
                <div className={styles.sortingStyles}>
                  <SortDropdown
                    sortValue={sortStore.sortTypes.order}
                    handleChangeSort={handleChangeSort}
                    sortOptions={sortByOrder}
                  />
                </div>
              )}
            </Box>
            {lessonStore.isLoadingLessons === 'true' ? (
              <InitLoader />
            ) : (
              <>
                {asPath === '/lessons?q=received' &&
                  (lessonStore.sharedLessons.length !== 0 ? (
                    <LessonCardWrapper>
                      {lessonStore.sharedLessons.map(
                        ({
                          mediaUrl,
                          name,
                          user,
                          word,
                          picture,
                          level,
                          avgRating,
                          sharedLessons,
                        }) => {
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
                              assignToClass={() => {
                                checkToAssignLesson();
                                lessonStore.setnewLessonId(sharedLessons[0].id);
                              }}
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
                              assignToClass={() => {
                                checkToAssignLesson();
                                lessonStore.setnewLessonId(id);
                              }}
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
                              assignToClass={() => {
                                checkToAssignLesson();
                                lessonStore.setnewLessonId(id);
                              }}
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
                        {t('lessons.seeLessons')}
                        &ensp;
                        <Link href={`/library/public`} passHref>
                          <span className={styles.linkPublic}>{t('lessons.publicLessons')}</span>
                        </Link>
                      </Typography>
                    </Box>
                  ))}
              </>
            )}
          </>
        </PageTitle>
      </Layout>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  };
}

export default observer(Lessons);
