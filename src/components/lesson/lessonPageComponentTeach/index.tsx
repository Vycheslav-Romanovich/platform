import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './index.module.scss';

import { InitLoader } from '~/components/initLoader';
import ModalPublicCard from '~/components/teacherClasses/modalPublicCard';
import { TeacherLessonCardWrapper } from '~/components/teacherClasses/teacherLessonCardWrapper';
import { lessonsStates, lessonsStatesTeacher } from '~/constants/routes';
import { sortByOrder } from '~/constants/sortLessons';
import { lessonStore, sortStore, teacherClassesStore, userStore } from '~/stores';
import { SortByOrderType } from '~/types/sort';
import { IAddTeacherLesson } from '~/types/teacherClass';
import SortDropdown from '~/UI/sortDropdown';
import TabBar from '~/UI/tabBar';

type Props = {
  classId?: number | null;
  isTeacherClass?: boolean;
};

const LessonPageComponentTeach: FC<Props> = ({ isTeacherClass, classId }) => {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    getMyLessons();
    return () => {
      sortStore.resetSortTypes();
    };
  }, []);

  const getMyLessons = async () => {
    await lessonStore.updateLessons(true);
  };

  const handleAddTeacherLesson = async (data: IAddTeacherLesson) => {
    const resp = await teacherClassesStore.addTeacherLesson(data);
    if (resp.message === 'TEACHER_LESSON_CREATED') {
      teacherClassesStore.toggleDoneButton(true);
      getMyLessons();
    }
  };

  const sortByType = (sortType: SortByOrderType) => {
    if (teacherClassesStore.myLessonPath === '/lessons?q=created') {
      sortStore.setLessonsSorted(sortType, lessonStore.lessons);
    } else {
      if (teacherClassesStore.myLessonPath === '/lessons?q=favorite') {
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

  return (
    <>
      <TabBar
        data={userStore?.user?.role === 'teacher' ? lessonsStatesTeacher : lessonsStates}
        nameData="lessonsStates"
        isTeach
      />
      <div className={styles.sortingStyles}>
        <SortDropdown
          sortValue={sortStore.sortTypes.order}
          handleChangeSort={handleChangeSort}
          sortOptions={sortByOrder}
          isTeach
        />
      </div>

      {lessonStore.isLoadingLessons === 'true' ? (
        <InitLoader />
      ) : (
        <div className={styles.lessonsWrapper}>
          {teacherClassesStore.myLessonPath === '/lessons?q=created' &&
            (lessonStore.lessons.length !== 0 ? (
              <TeacherLessonCardWrapper>
                {lessonStore.lessons.map(
                  ({ id, mediaUrl, name, user, word, picture, level, teacherClasses }) => {
                    return (
                      <ModalPublicCard
                        key={id}
                        id={id}
                        mediaUrl={mediaUrl}
                        titleLesson={name}
                        lessonOwnerAvatar={user.avatarUrl}
                        lessonOwnerName={user.name}
                        numberWords={+word.length}
                        coverIndex={picture}
                        level={level}
                        teacherClassesArr={teacherClasses?.some(
                          ({ id }) => id === (+router.query.classId || classId)
                        )}
                        isTeacherClass={isTeacherClass}
                        addTeacherLesson={() =>
                          handleAddTeacherLesson({
                            classId: +router.query.classId || classId,
                            lessonId: id,
                          })
                        }
                      />
                    );
                  }
                )}
              </TeacherLessonCardWrapper>
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
          {teacherClassesStore.myLessonPath === '/lessons?q=favorite' &&
            (lessonStore.favoriteLessons.length !== 0 ? (
              <TeacherLessonCardWrapper>
                {lessonStore.favoriteLessons.map(
                  ({ id, mediaUrl, name, user, word, picture, level, teacherClasses }) => {
                    return (
                      <ModalPublicCard
                        key={id}
                        id={id}
                        mediaUrl={mediaUrl}
                        titleLesson={name}
                        lessonOwnerAvatar={user.avatarUrl}
                        lessonOwnerName={user.name}
                        numberWords={+word.length}
                        coverIndex={picture}
                        level={level}
                        teacherClassesArr={teacherClasses?.some(
                          ({ id }) => id === (+router.query.classId || classId)
                        )}
                        isTeacherClass={isTeacherClass}
                        addTeacherLesson={() =>
                          handleAddTeacherLesson({
                            classId: +router.query.classId || classId,
                            lessonId: id,
                          })
                        }
                      />
                    );
                  }
                )}
              </TeacherLessonCardWrapper>
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
        </div>
      )}
    </>
  );
};
export default observer(LessonPageComponentTeach);
