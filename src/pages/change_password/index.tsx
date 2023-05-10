import React from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Layout from '../../hocs/layout';

import styles from './index.module.scss';

import { WrapperPage } from '~/components/auth/wrapperPage';
import { NewPassword } from '~/components/newPassword';

const ChangePassword: NextPage = () => {
  return (
    <>
      <NextSeo title="New password" description="" />

      <Layout hidePadding bg="sky" classNameContent={styles.noMaxWidth}>
        <WrapperPage>
          <NewPassword />
        </WrapperPage>
      </Layout>
    </>
  );
};

export default ChangePassword;
