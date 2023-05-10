import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import Link from 'next/link';

import styles from './index.module.scss';

type Props = {
  id?: number;
  titleApp?: string;
  description?: string;
  img?: any;
  href?: string;
};

export const AppCard: React.FC<Props> = ({ id, img, titleApp, href, description }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ position: 'relative' }}>
      <Link href={href} passHref>
        <a target="_blank">
          <div className={styles.wrapper}>
            <Image className={styles.img} width={391} height={180} src={img} alt="AppImg" />
            <Box sx={{ height: '100%' }}>
              <div className={styles.titleWrapper} data-title={titleApp}>
                <Typography variant="h4" className={styles.title}>
                  {titleApp}
                </Typography>
                <div className={styles.description}>{description}</div>
              </div>
            </Box>
          </div>
        </a>
      </Link>
    </Box>
  );
};
