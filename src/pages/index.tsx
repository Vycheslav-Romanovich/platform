import React from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Layout from '../hocs/layout';

import { AuthLanding } from '~/components/authLanding';
import { InitLoader } from '~/components/initLoader';
import { Landing } from '~/components/landing';
import { userStore } from '~/stores';

const Home: NextPage = () => {
  const { isAuth, isInit } = userStore;
  const { t } = useTranslation();

  return (
    <>
      <NextSeo
        title={t('seo.main.name')}
        description={t('seo.main.description')}
        additionalMetaTags={[{ property: 'keywords', content: t('seo.main.keyWords') }]}
      />

      {!isInit ? (
        <InitLoader position="centerPage" />
      ) : (
        <Layout
          showFooter
          hidePadding={!isAuth && true}
          bg={isAuth ? 'white' : 'gradient'}
          style={{ height: 'initial' }}
        >
          {isAuth ? <AuthLanding /> : <Landing />}
        </Layout>
      )}
    </>
  );
};

export default observer(Home);
