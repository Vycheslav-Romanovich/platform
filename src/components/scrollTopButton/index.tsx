import { memo, useEffect, useState } from 'react';
import { Button, useMediaQuery } from '@mui/material';

import ArrowUpIcon from '~/assets/icons/arrows/arrowUp.svg';

import styles from './index.module.scss';

const ScrollTopButton = () => {
  const [showButton, setShowButton] = useState(false);
  const isTabletSize = useMediaQuery('(max-width: 1023px)');
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    !isTabletSize &&
    showButton && (
      <Button type="button" variant="outlined" className={styles.button} onClick={handleClick}>
        <ArrowUpIcon />
      </Button>
    )
  );
};

export default memo(ScrollTopButton);
