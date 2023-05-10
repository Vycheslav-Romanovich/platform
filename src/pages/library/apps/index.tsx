import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import styles from './index.module.scss';

import { AppCard } from '~/components/appCard';
import { LessonCardWrapper } from '~/components/lesson/lessonCardWrapper';
import { gamesBlock, grammarBlock, listeningBlock, vocabularyBlock } from '~/constants/blocksApps';
import { libraryStates } from '~/constants/routes';
import Layout from '~/hocs/layout';
import TabBar from '~/UI/tabBar';

const Library: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <NextSeo
        title={t('seo.library.apps.name')}
        description={t('seo.library.apps.description')}
        additionalMetaTags={[{ property: 'keywords', content: t('seo.library.apps.keyWords') }]}
      />

      <Layout>
        <h2 className={styles.headerText}>{t('routes.navLinks.Library')}</h2>

        <TabBar data={libraryStates} nameData="libraryStates" />

        <Typography variant="h3" className={styles.chapterName}>
          {t('apps.chapter.grammar')}
        </Typography>

        <LessonCardWrapper>
          {grammarBlock.map((item) => {
            return (
              <AppCard
                key={item.id}
                img={item.Img}
                titleApp={item.title}
                description={item.description}
                href={item.href}
              />
            );
          })}
        </LessonCardWrapper>

        <Typography variant="h3" className={styles.chapterName}>
          {t('apps.chapter.vocabulary')}
        </Typography>

        <LessonCardWrapper>
          {vocabularyBlock.map((item) => {
            return (
              <AppCard
                key={item.id}
                img={item.Img}
                titleApp={item.title}
                description={item.description}
                href={item.href}
              />
            );
          })}
        </LessonCardWrapper>

        <Typography variant="h3" className={styles.chapterName}>
          {t('apps.chapter.games')}
        </Typography>

        <LessonCardWrapper>
          {gamesBlock.map((item) => {
            return (
              <AppCard
                key={item.id}
                img={item.Img}
                titleApp={item.title}
                description={item.description}
                href={item.href}
              />
            );
          })}
        </LessonCardWrapper>

        <Typography variant="h3" className={styles.chapterName}>
          {t('apps.chapter.listening')}
        </Typography>

        <LessonCardWrapper>
          {listeningBlock.map((item) => {
            return (
              <AppCard
                key={item.id}
                img={item.Img}
                titleApp={item.title}
                description={item.description}
                href={item.href}
              />
            );
          })}
        </LessonCardWrapper>
      </Layout>
    </>
  );
};

export default Library;
