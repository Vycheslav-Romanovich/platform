import React from 'react';
import Link from 'next/link';

import LogoSvg from '../../../assets/icons/logo.svg';

import styles from './index.module.scss';

type Props = {
  className?: string;
};

export const Logo: React.FC<Props> = ({ className }) => {
  return (
    <Link href="/">
      <a className={`${styles.logoContainer} ${className}`}>
        <LogoSvg className={styles.logo} />
        <span className={styles.logoText}>eLang</span>
      </a>
    </Link>
  );
};
