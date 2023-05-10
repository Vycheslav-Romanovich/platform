import React from 'react';
import { observer } from 'mobx-react';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import { PageTitle } from '~/entities/PageTitle';
import Layout from '~/hocs/layout';
import { SubscriptionInfo } from '~/widget/SubscriptionInfo';

const SubscriptionPremium: NextPage = () => {
  return (
    <>
      <NextSeo title="Subscription" />

      <Layout>
        <PageTitle title="Subscription" maxWidth="795px">
          <SubscriptionInfo />
        </PageTitle>
      </Layout>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  };
}

export default observer(SubscriptionPremium);
