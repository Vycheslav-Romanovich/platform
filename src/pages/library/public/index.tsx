import React, { useEffect, useState } from 'react';
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
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import styles from './index.module.scss';

import { InitLoader } from '~/components/initLoader';
import { LessonCardWrapper } from '~/components/lesson/lessonCardWrapper';
import { PublicCard } from '~/components/lesson/publicCard';
import { libraryStates } from '~/constants/routes';
import {
  sortByContent,
  sortByCreated,
  sortByEnglishLevel,
  sortByNumberOfTerms,
  sortByOrder,
} from '~/constants/sortLessons';
import { sendEvent } from '~/helpers/sendToGtm';
import Layout from '~/hocs/layout';
import { lessonStore, sortStore } from '~/stores';
import { SearchInput } from '~/UI/searchInput';
import TabBar from '~/UI/tabBar';

const Public: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const paths = libraryStates.map((el) => el.path);
  const [value, setValue] = useState(paths.indexOf(router.asPath));

  const handleChangeSort = (event) => {
    const name = event.target.name;
    const value = event.target.value as string;

    sortStore.setSortTypes({ [name]: value });
    router.query = { ...router.query, [name]: value };
    router.push({
      pathname: router.pathname,
      query: { ...router.query },
    });

    if (name !== 'search') {
      sendEvent('set_filter_lessons', { filter_type: name, value: value });
      getLessons(true);
    }
  };

  const handleChangePagination = (event: React.ChangeEvent<unknown>, page: number) => {
    if (+sortStore.sortTypes.page !== page) {
      sortStore.setSortTypes({ page });
      router.query = { ...router.query, page: page.toString() };
      router.push({
        pathname: router.pathname,
        query: { ...router.query },
      });
      getLessons();
    }
  };

  const handleResetSearch = async () => {
    sortStore.setSortTypes({ search: '' });

    router.push({
      pathname: router.pathname,
      query: { ...router.query, search: '' },
    });
    await lessonStore.getLessonDataPublic();
  };

  const getLessons = async (isFirstPage?: boolean) => {
    if (isFirstPage) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: 1 },
      });
      await lessonStore.getLessonDataPublic({ ...sortStore.sortTypes, page: 1 });
    } else {
      await lessonStore.getLessonDataPublic(sortStore.sortTypes);
    }

    await sortStore.setSearchQuery(sortStore.sortTypes.search);
  };

  const getLessonsFromSearch = async () => {
    const searchParams = window.location.search;

    lessonStore.getLessonDataPublicFromString(searchParams);
  };

  const onSubmit = () => {
    if (sortStore.sortTypes.search.length && sortStore.searchQuery !== sortStore.sortTypes.search) {
      getLessons(true);
    }
  };

  useEffect(() => {
    sortStore.setSortTypes({ ...router.query });
    getLessons();
  }, [router.query]);

  useEffect(() => {
    getLessonsFromSearch();

    return () => {
      sortStore.resetSortTypes();
    };
  }, []);

  useEffect(() => {
    setValue(paths.indexOf(router.asPath));
  }, [router.asPath]);

  return (
    <>
      <NextSeo
        title={t('seo.library.public.name')}
        description={t('seo.library.public.description')}
        additionalMetaTags={[{ property: 'keywords', content: t('seo.library.public.keyWords') }]}
      />

      <Layout>
        <h2 className={styles.headerText}>{t('routes.navLinks.Library')}</h2>

        <TabBar data={libraryStates} nameData="libraryStates" />

        <div className={styles.toolbar}>
          <SearchInput
            name="search"
            placeholder={t('library.public.placeholderSearch')}
            value={sortStore.sortTypes.search}
            onChange={handleChangeSort}
            onReset={handleResetSearch}
            onSubmit={onSubmit}
          />

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
              <InputLabel id="content-type-label">{t('library.public.labelContent')}</InputLabel>
              <Select
                labelId="content-type-label"
                id="content-type"
                value={sortStore.sortTypes.type}
                label={t('library.public.labelContent')}
                variant="outlined"
                onChange={handleChangeSort}
                name="type"
              >
                {sortByContent.map(({ lable, value }, index) => {
                  return (
                    <MenuItem key={index} value={value}>
                      <Typography variant="button1">
                        {t(`sortLessons.sortByContent.${lable}`)}
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

        {/* filter by alphabet and date */}
        <Box sx={{ mb: '24px', mt: '32px', display: 'flex', justifyContent: 'flex-end' }}>
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
        </Box>

        {lessonStore.isLoadingPublicLessons === 'true' ? (
          <InitLoader />
        ) : (
          <LessonCardWrapper>
            {lessonStore.lessonsPublic.totalResults !== 0
              ? lessonStore.lessonsPublic.data.map(
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
                        coverIndex={picture}
                        level={level}
                        rating={avgRating}
                      />
                    );
                  }
                )
              : t('authLanding.noLessons')}
          </LessonCardWrapper>
        )}

        <Pagination
          page={+sortStore.sortTypes.page}
          count={lessonStore.paginationCount > 15 ? 15 : lessonStore.paginationCount}
          color="primary"
          boundaryCount={1}
          shape="rounded"
          onChange={handleChangePagination}
          className={styles.pagination}
        />
      </Layout>
    </>
  );
};

export default observer(Public);
