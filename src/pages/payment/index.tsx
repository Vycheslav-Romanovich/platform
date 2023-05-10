import { NextSeo } from 'next-seo';

import { BreadCrumbs } from '~/entities/BreadCrumbs';
import Layout from '~/hocs/layout';
import { PaymentBlock } from '~/widget/PaymentBlock';

const Payment: React.FC = () => {
  return (
    <>
      <NextSeo title="Payment" />

      <Layout bg="sky">
        <BreadCrumbs hrefBack="/subscription-plans" previosPage="Pricing" currentPage="Payment" />
        <PaymentBlock />
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

export default Payment;
