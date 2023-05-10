import React from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Layout from '../../hocs/layout';

import styles from './index.module.scss';

import { Auth } from '~/components/auth';
import { WrapperPage } from '~/components/auth/wrapperPage';

const Login: NextPage = () => {
  return (
    <>
      <NextSeo title="Login" description="" />

      <Layout hidePadding bg="sky" classNameContent={styles.noMaxWidth}>
        <WrapperPage>
          <Auth type="login" />
        </WrapperPage>
      </Layout>
    </>
  );
};

export default Login;
