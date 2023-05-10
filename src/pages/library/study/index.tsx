import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import Level_1 from '~/assets/images/level_1.svg';

import styles from './index.module.scss';

import { libraryStates } from '~/constants/routes';
import GreetingBlock from '~/games/irregularVerbs/componentsOfTrainer/GreetingBlock/GreetingBlock';
import Title from '~/games/irregularVerbs/componentsOfTrainer/Title/Title';
import Wrap from '~/games/irregularVerbs/componentsOfTrainer/Wrap/Wrap';
import { partsOfVerbs } from '~/games/irregularVerbs/data/verbs';
import Layout from '~/hocs/layout';
import TabBar from '~/UI/tabBar';

const Library: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const paths = libraryStates.map((el) => el.path);
  const [value, setValue] = useState(paths.indexOf(router.asPath));

  useEffect(() => {
    setValue(paths.indexOf(router.asPath));
  }, [router.asPath]);

  return (
    <>
      <NextSeo
        title={t('seo.library.study.name')}
        description={t('seo.library.study.description')}
        additionalMetaTags={[{ property: 'keywords', content: t('seo.library.study.keyWords') }]}
      />

      <Layout>
        <h2 className={styles.headerText}>{t('routes.navLinks.Library')}</h2>

        <TabBar data={libraryStates} nameData="libraryStates" />

        <GreetingBlock />

        <Title title={t('library.study.titleLevel')} />

        <Wrap
          array={partsOfVerbs}
          title={t('authLanding.titleIrregular')}
          textBottom={t('authLanding.textIrregular')}
          levelText={t('authLanding.levelIrregular')}
          image={<Level_1 />}
        />
      </Layout>
    </>
  );
};

export default Library;
