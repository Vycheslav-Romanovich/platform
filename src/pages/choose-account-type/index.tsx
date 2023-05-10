import React from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Layout from '../../hocs/layout';

import styles from './index.module.scss';

import { ChoiseOfPath } from '~/components/auth/choiseOfPath';
import { WrapperPage } from '~/components/auth/wrapperPage';

const ChoosecAcountType: NextPage = () => {
  return (
    <>
      <NextSeo title="signup" description="" />

      <Layout hidePadding bg="sky" classNameContent={styles.noMaxWidth}>
        <WrapperPage>
          <ChoiseOfPath isGoogleReg />
        </WrapperPage>
      </Layout>
    </>
  );
};

export default ChoosecAcountType;
