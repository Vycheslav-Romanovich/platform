import { NextSeo } from 'next-seo';

import Layout from '../../../../hocs/layout';

import './irregular-verbs.module.scss';

const CombineLetters = () => {
  return (
    <>
      <NextSeo title="Combine letters" />
      <Layout>CombineLetters</Layout>
    </>
  );
};

export default CombineLetters;
