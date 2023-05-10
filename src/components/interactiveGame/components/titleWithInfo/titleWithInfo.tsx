import React from 'react';
import { Typography } from '@mui/material';

import Info from './info/info';

import styles from './titleWithInfo.module.scss';

type Props = {
  infoText: string;
  title: string;
};

export const TitleWithInfo: React.FC<Props> = ({ infoText, title }) => {
  return (
    <div className={styles.titleBlock}>
      <Typography variant={'h3'}>{title}</Typography>

      <Info width={142} height={62} marginHint={-27} bottomPolygon={17} text={infoText} />
    </div>
  );
};
