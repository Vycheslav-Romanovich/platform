import React from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Layout from '../../hocs/layout';

import styles from './index.module.scss';

import { WrapperPage } from '~/components/auth/wrapperPage';
import { RestorePassword } from '~/components/restorePassword';

const Restore: NextPage = () => {
  return (
    <>
      <NextSeo title="Restore password" description="" />

      <Layout hidePadding bg="sky" classNameContent={styles.noMaxWidth}>
        <WrapperPage>
          <RestorePassword />
        </WrapperPage>
      </Layout>
    </>
  );
};

export default Restore;
