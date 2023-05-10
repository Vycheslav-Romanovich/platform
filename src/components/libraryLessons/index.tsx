import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import ModalPublicCard from '../teacherClasses/modalPublicCard';
import { TeacherLessonCardWrapper } from '../teacherClasses/teacherLessonCardWrapper';

import styles from './index.module.scss';

import { InitLoader } from '~/components/initLoader';
import { sortByCreated, sortByEnglishLevel, sortByNumberOfTerms } from '~/constants/sortLessons';
import { lessonStore, sortStore, teacherClassesStore } from '~/stores';
import { IAddTeacherLesson } from '~/types/teacherClass';
import { SearchInput } from '~/UI/searchInput';

type Props = {
  isTeacherClass?: boolean;
  classId?: number | null;
};

const LibraryLessons: FC<Props> = ({ isTeacherClass, classId }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [openFilter, setIsOpenFilter] = useState(false);

  const handleChangeSort = (event) => {
    const name = event.target.name;
    const value = event.target.value as string;
    sortStore.setSortTypes({ [name]: value });
    getLessons();
  };

  const handleChangePagination = (event: ChangeEvent<unknown>, page: number) => {
    if (+sortStore.sortTypes.page !== page) {
      sortStore.setSortTypes({ page });
      getLessons();
    }
  };

  const handleResetSearch = async () => {
    sortStore.setSortTypes({ search: '' });
    await lessonStore.getLessonDataPublic();
  };

  const getLessons = async (isLoading?: boolean) => {
    await lessonStore.getLessonDataPublic(
      {
        ...sortStore.sortTypes,
        isTeacherClass: true,
        page: sortStore.sortTypes.page,
      },
      isLoading
    );
  };

  const onSubmit = () => {
    if (sortStore.sortTypes.search.length && sortStore.searchQuery !== sortStore.sortTypes.search) {
      getLessons();
    }
  };

  // useEffect(() => {
  //   sortStore.setSortTypes({ ...router.query });
  // }, [router.query]);

  useEffect(() => {
    getLessons();
    return () => {
      sortStore.resetSortTypes();
    };
  }, []);

  const handleAddTeacherLesson = async (data: IAddTeacherLesson) => {
    const resp = await teacherClassesStore.addTeacherLesson(data);
    if (resp.message === 'TEACHER_LESSON_CREATED') {
      teacherClassesStore.toggleDoneButton(true);
      getLessons(true);
    }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <SearchInput
          name="search"
          placeholder={t('library.public.placeholderSearch')}
          value={sortStore.sortTypes.search}
          onChange={handleChangeSort}
          onReset={handleResetSearch}
          onSubmit={onSubmit}
          isTeacherClasses
        />
        {/* filter by alphabet and date uncomment */}
        {/* <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'absolute',
            right: '48px',
            top: '190px',
          }}
        >
          <Select
            id="order"
            value={sortStore.sortTypes.order}
            variant="standard"
            name="order"
            onChange={handleChangeSort}
            disableUnderline
          >
            {sortByOrder.map(({ lable, value }, index) => {
              return (
                <MenuItem key={index} value={value}>
                  <Typography variant="button1">{t(`sortLessons.sortByOrder.${lable}`)}</Typography>
                </MenuItem>
              );
            })}
          </Select>
        </Box> */}

        {/* <Filter
          isExpandFilter={openFilter}
          setIsExpandFilter={() => setIsOpenFilter((prev) => !prev)}
        /> */}

        {openFilter && (
          <div className={styles.filters}>
            <Box sx={{ minWidth: 184 }}>
              <FormControl fullWidth>
                <InputLabel id="level-label">{t('library.public.labelLevel')}</InputLabel>
                <Select
                  labelId="level-label"
                  id="level"
                  value={sortStore.sortTypes.level}
                  label={t('library.public.labelLevel')}
                  variant="outlined"
                  onChange={handleChangeSort}
                  name="level"
                >
                  {sortByEnglishLevel.map(({ lable, value }, index) => {
                    return (
                      <MenuItem key={index} value={value}>
                        <Typography variant="button1">
                          {t(`sortLessons.sortByEnglishLevel.${lable}`)}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ minWidth: 160 }}>
              <FormControl fullWidth>
                <InputLabel id="created-label">{t('library.public.labelCreate')}</InputLabel>
                <Select
                  labelId="created-label"
                  id="created"
                  value={sortStore.sortTypes.created}
                  label={t('library.public.labelCreate')}
                  variant="outlined"
                  onChange={handleChangeSort}
                  name="created"
                >
                  {sortByCreated.map(({ lable, value }, index) => {
                    return (
                      <MenuItem key={index} value={value}>
                        <Typography variant="button1">
                          {t(`sortLessons.sortByCreated.${lable}`)}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ minWidth: 140 }}>
              <FormControl fullWidth>
                <InputLabel id="terms-label">{t('library.public.labelNumber')}</InputLabel>
                <Select
                  labelId="terms-label"
                  id="terms"
                  value={sortStore.sortTypes.numberOfTerms}
                  label={t('library.public.labelNumber')}
                  variant="outlined"
                  onChange={handleChangeSort}
                  name="numberOfTerms"
                >
                  {sortByNumberOfTerms.map(({ lable, value }, index) => {
                    return (
                      <MenuItem key={index} value={value}>
                        <Typography variant="button1">
                          {t(`sortLessons.sortByNumberOfTerms.${lable}`)}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </div>
        )}
      </div>

      {lessonStore.isLoadingPublicLessons === 'true' ? (
        <InitLoader />
      ) : (
        <div className={styles.lessonsWrapper}>
          <TeacherLessonCardWrapper>
            {lessonStore.lessonsPublic.totalResults !== 0
              ? lessonStore.lessonsPublic.data.map(
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
                )
              : t('authLanding.noLessons')}
          </TeacherLessonCardWrapper>
          <Pagination
            page={+sortStore.sortTypes.page}
            count={lessonStore.paginationCount > 15 ? 15 : lessonStore.paginationCount}
            color="primary"
            boundaryCount={1}
            shape="rounded"
            onChange={handleChangePagination}
            className={styles.pagination}
          />
        </div>
      )}
    </>
  );
};

export default observer(LibraryLessons);
