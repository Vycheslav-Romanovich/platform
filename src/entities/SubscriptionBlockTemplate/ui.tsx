import React from 'react';
import { Typography, useMediaQuery } from '@mui/material';

import styles from './styles.module.scss';

type Props = {
  title: string;
  children: JSX.Element;
  note?: string;
};

export const SubscriptionBlockTemplate: React.FC<Props> = ({ title, note, children }) => {
  const isMobile = useMediaQuery('(max-width:767px)');
  const titleStyle = `${styles.sectionTitle} ${note && styles.border}`;
  const childrenBoxStyle = `${styles.sectionMain} ${
    note ? styles.paddingMain : styles.paddingTable
  }`;

  return (
    <section className={styles.section}>
      <Typography className={titleStyle} variant="h4">
        {title}
      </Typography>

      {note && (
        <Typography className={styles.sectionNote} variant={isMobile ? 'text3' : 'body3'}>
          {note}
        </Typography>
      )}

      {note ? <div className={childrenBoxStyle}>{children}</div> : children}
    </section>
  );
};
