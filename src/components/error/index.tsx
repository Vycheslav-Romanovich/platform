import React from 'react';

import Error from '~/assets/icons/error.svg';

import styles from './index.module.scss';

type Props = {
  children: string;
  isLogin?: boolean;
};

export const ErrorValidation: React.FC<Props> = ({ children, isLogin }) => {
  return (
    <div className={styles.errorCenter}>
      {isLogin ? null : <Error />}
      {children}
    </div>
  );
};
