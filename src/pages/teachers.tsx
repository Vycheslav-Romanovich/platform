import React from 'react';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Layout from '../hocs/layout';

import { AuthLanding } from '~/components/authLanding';
import { LandingAB } from '~/components/landingAB';
import { userStore } from '~/stores';

const Home: NextPage = () => {
  const { isAuth } = userStore;
  return (
    <>
      <NextSeo title="Main page" />
      <Layout>{isAuth ? <AuthLanding /> : <LandingAB />}</Layout>
    </>
  );
};

export default observer(Home);
