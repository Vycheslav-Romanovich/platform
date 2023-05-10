import { NextPage } from 'next/types';
import { NextSeo } from 'next-seo';

import styles from './index.module.scss';

import { TrackStudentProgress } from '~/components/landing/TrackStudentProgress';
import { NoLimits } from '~/entities/NoLimits';
import { PageTitle } from '~/entities/PageTitle';
import { TrialSevenDays } from '~/entities/TrialSevenDays';
import Layout from '~/hocs/layout';
import { ChoosePlan } from '~/widget/ChoosePlan';

const SubscriptionPlans: NextPage = () => {
  return (
    <>
      <NextSeo title="Subscription plans" />

      <Layout bg="lBlue" classNameContent={styles.layout}>
        <PageTitle title="Start free 14-days trial" center>
          <>
            <ChoosePlan ancor="TrackStudentProgress" />
            <TrackStudentProgress id="TrackStudentProgress" />
            <NoLimits />
            <TrialSevenDays />
          </>
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

export default SubscriptionPlans;
