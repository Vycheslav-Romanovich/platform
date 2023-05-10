import React from 'react';
import { CircularProgress } from '@mui/material';
import classNames from 'classnames';

import { Dots } from './dots';

import styles from './initLoader.module.scss';

type Props = {
  type?: 'dots' | 'circular';
  position?: 'centerPage';
  className?: string;
  style?: React.CSSProperties;
};
export const InitLoader: React.FC<Props> = ({ position, type = 'circular', className, style }) => {
  const wrapper = classNames(className, {
    [styles.wrapper]: position === 'centerPage',
  });

  return (
    <div style={style} className={wrapper}>
      {type === 'circular' && <CircularProgress />}
      {type === 'dots' && <Dots />}
    </div>
  );
};
