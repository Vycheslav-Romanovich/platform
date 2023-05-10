import React from 'react';
import { Typography } from '@mui/material';
import Image, { StaticImageData } from 'next/image';

import styles from './index.module.scss';

type HelpsBlockWrapperType = {
  image: StaticImageData;
  title: string;
  subtitle: string;
};

export const HowHelpsBlock: React.FC<HelpsBlockWrapperType> = ({ image, title, subtitle }) => {
  return (
    <div className={styles.helpBlock}>
      <Image src={image} alt={title} />
      <Typography variant={'h3'} sx={{ marginTop: '32px' }}>
        {title}
      </Typography>
      <Typography variant={'text1'} color={'var(--Grey)'} sx={{ marginTop: '8px' }}>
        {subtitle}
      </Typography>
    </div>
  );
};
