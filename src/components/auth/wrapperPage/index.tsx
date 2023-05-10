import React from 'react';

import styles from './index.module.scss';

import { LeftBlock } from '~/components/auth/leftBlock';
import { RightBlock } from '~/components/auth/rightBlock';

type Props = {
  children: React.ReactNode;
};

export const WrapperPage: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <LeftBlock />

      <RightBlock>{children}</RightBlock>
    </div>
  );
};
